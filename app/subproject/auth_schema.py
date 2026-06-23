from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr


# -------------------------------
# User Roles
# -------------------------------

class UserRole(str, Enum):
    SUPER_ADMIN = "SUPER ADMIN"
    ADMIN = "ADMIN"
    PHARMACIST = "PHARMACIST"
    WAREHOUSE_MANAGER = "WAREHOUSE_MANAGER"
    CUSTOMER = "CUSTOMER"


# -------------------------------
# User Registration Schema
# -------------------------------

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.CUSTOMER


# -------------------------------
# User Login Schema
# -------------------------------

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# -------------------------------
# JWT Token Response
# -------------------------------

class Token(BaseModel):
    access_token: str
    token_type: str


# -------------------------------
# Token Payload
# -------------------------------

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# -------------------------------
# User Response
# -------------------------------

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True