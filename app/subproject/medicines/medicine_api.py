from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config.db import get_db

from app.subproject.medicines.medicine_schema import MedicineCreate
from app.subproject.medicines.medicine_service import MedicineService


router = APIRouter(
    prefix="/medicines",
    tags=["Medicines"]
)


@router.post("/")
def create_medicine(
    request: MedicineCreate,
    db: Session = Depends(get_db),
):
    return MedicineService.create_medicine(db, request)


@router.get("/")
def get_all_medicines(
    db: Session = Depends(get_db),
):
    return MedicineService.get_all_medicines(db)