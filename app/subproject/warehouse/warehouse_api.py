from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from config.db import get_db
from app.subproject.warehouse.warehouse_schema import (
    WarehouseCreate,
    WarehouseResponse,
    WarehouseUpdate,
    WarehouseDelete,
)
from app.subproject.warehouse.warehouse_service import WarehouseService

router = APIRouter(prefix="/warehouse", tags=["Warehouse"])


@router.get("/", response_model=list[WarehouseResponse])
def get_all(db: Session = Depends(get_db)):
    return WarehouseService.get_all(db)


@router.get("/{warehouse_id}", response_model=WarehouseResponse)
def get_by_id(warehouse_id: int, db: Session = Depends(get_db)):
    warehouse = WarehouseService.get_by_id(db, warehouse_id)

    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse stock not found")

    return warehouse


@router.post("/", response_model=WarehouseResponse)
def create(warehouse: WarehouseCreate, db: Session = Depends(get_db)):
    return WarehouseService.create(db, warehouse)


@router.post("/update", response_model=WarehouseResponse)
def update(
    warehouse: WarehouseUpdate,
    db: Session = Depends(get_db),
):
    updated = WarehouseService.update(db, warehouse.id, warehouse)

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Warehouse stock not found",
        )

    return updated


@router.post("/delete")
def delete(
    request: WarehouseDelete,
    db: Session = Depends(get_db),
):
    deleted = WarehouseService.delete(db, request.id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Warehouse stock not found",
        )

    return {"message": "Warehouse stock deleted successfully"}