from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from config.config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

from models import User, Role
from app.subproject.auth_schema import RegisterRequest


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


class AuthService:

    @staticmethod
    def hash_password(password: str):
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(
        plain_password: str,
        hashed_password: str,
    ):
        return pwd_context.verify(
            plain_password,
            hashed_password,
        )

    @staticmethod
    def create_access_token(data: dict):

        payload = data.copy()

        expire = (
            datetime.now(timezone.utc)
            + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        payload.update(
            {
                "exp": expire
            }
        )

        return jwt.encode(
            payload,
            SECRET_KEY,
            algorithm=ALGORITHM,
        )

    @staticmethod
    def register_user(
        db: Session,
        request: RegisterRequest,
    ):

        existing_user = (
            db.query(User)
            .filter(User.email == request.email)
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered.",
            )

        role = (
            db.query(Role)
            .filter(Role.name.ilike(request.role.value))
            .first()
        )

        if role is None:
            raise HTTPException(
                status_code=404,
                detail="Role not found.",
            )

        hashed_password = AuthService.hash_password(
            request.password
        )

        new_user = User(
            username=request.username,
            email=request.email,
            password=hashed_password,
            role_id=role.id,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User registered successfully."
        }

    @staticmethod
    def login_user(
        db: Session,
        email: str,
        password: str,
    ):

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        print("Entered email:", email)
        print("Entered password:", password)
        print("User found:", user)

        if user is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials.",
            )

        print("Stored hash:", user.password)

        password_matches = AuthService.verify_password(
            password,
            user.password,
        )

        print("Password matches:", password_matches)

        if not password_matches:
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials.",
            )

        access_token = AuthService.create_access_token(
            {
                "sub": str(user.id),
                "email": user.email,
                "role": user.role.name,
            }
        )

        return {
            "access_token": access_token,
            "token_type": "jwt",   # change to "bearer" if your API expects Bearer
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role.name,
            },
        }

    @staticmethod
    def get_current_user(
        token: str,
        db: Session,
    ):

        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
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