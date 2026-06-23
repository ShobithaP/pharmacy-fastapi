from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from fastapi.security import OAuth2PasswordBearer

from jose import JWTError
from jose import jwt

from sqlalchemy.orm import Session

from config.db import get_db

from config.config import (
    SECRET_KEY,
    ALGORITHM,
)

from models import (
    User,
    Permission,
    RolePermission,
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/token"
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = (
        db.query(User)
        .filter(User.id == int(user_id))
        .first()
    )

    if user is None:
        raise credentials_exception

    return user


def require_permission(permission_name: str):

    def permission_checker(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ):

        permission = (
            db.query(Permission)
            .filter(Permission.name == permission_name)
            .first()
        )

        if permission is None:

            raise HTTPException(
                status_code=404,
                detail="Permission not found."
            )

        mapping = (
            db.query(RolePermission)
            .filter(
                RolePermission.role_id == current_user.role.id,
                RolePermission.permission_id == permission.id
            )
            .first()
        )

        if mapping is None:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied."
            )

        return current_user

    return permission_checker