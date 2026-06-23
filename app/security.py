from fastapi import Depends, HTTPException, status

from app.subproject.dependencies import get_current_user

def require_roles(*roles):
    def role_checker(current_user=Depends(get_current_user)):

        user_role = current_user.role.name.upper()

        allowed_roles = [role.upper() for role in roles]

        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to perform this action.",
            )

        return current_user

    return role_checker