
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm



from sqlalchemy.orm import Session

from config.db import get_db

from app.subproject.auth_service import AuthService
from app.subproject.auth_schema import RegisterRequest,LoginRequest

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    return AuthService.register_user(
        db=db,
        request=request,
    )


# Existing JSON login (for frontend)



@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    return AuthService.login_user(
        db=db,
        email=request.email,
        password=request.password,
    )


@router.post("/token")
def login_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    return AuthService.login_user(
        db=db,
        email=form_data.username,
        password=form_data.password,
    )