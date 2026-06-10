from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.db import get_db

from app.subproject.service import (
    add_medicine_service,
    get_medicines_service,
    get_medicine_service,
    add_stock_service,
    get_stocks_service
)

from app.subproject.schema.medicine_schema import (
    MedicineCreate,
    MedicineResponse,
    WarehouseStockCreate,
    WarehouseStockResponse
)

router = APIRouter(
    tags=["Medicines"]
)


@router.get("/")
def home():
    return {
        "message": "Pharmacy API Running"
    }


@router.post(
    "/medicines",
    response_model=MedicineResponse
)
def add_medicine(
    medicine: MedicineCreate,
    db: Session = Depends(get_db)
):
    return add_medicine_service(
        db,
        medicine
    )


@router.get(
    "/medicines",
    response_model=list[MedicineResponse]
)
def get_medicines(
    db: Session = Depends(get_db)
):
    return get_medicines_service(
        db
    )


@router.get(
    "/medicines/{medicine_id}",
    response_model=MedicineResponse
)
def get_medicine(
    medicine_id: int,
    db: Session = Depends(get_db)
):
    return get_medicine_service(
        db,
        medicine_id
    )


@router.post(
    "/warehouse-stock",
    response_model=WarehouseStockResponse
)
def add_stock(
    stock: WarehouseStockCreate,
    db: Session = Depends(get_db)
):
    return add_stock_service(
        db,
        stock
    )


@router.get(
    "/warehouse-stock",
    response_model=list[WarehouseStockResponse]
)
def get_stocks(
    db: Session = Depends(get_db)
):
    return get_stocks_service(
        db
    )