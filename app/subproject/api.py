from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

import csv
import io

from config.db import get_db

from app.security import require_roles

from app.subproject.medicines.medicine_model import Medicine
from app.subproject.warehouse.warehouse_model import WarehouseStock
from models import User



from app.subproject.service import (
    add_medicine_service,
    get_medicines_service,
    get_medicine_service,
    add_stock_service,
    get_stocks_service
)

from app.subproject.medicines.medicine_schema import (
    MedicineCreate,
    MedicineResponse,
    WarehouseStockCreate,
    WarehouseStockResponse
)
router = APIRouter(
    tags=["Medicines"]
)


@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "SUPER_ADMIN"
        )
    )
):

    users = db.query(User).all()

    return [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role.name
        }
        for u in users
    ]


@router.post("/users/delete/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "SUPER_ADMIN"
        )
    )
):

    target_user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if target_user:

        db.delete(target_user)

        db.commit()

    return {
        "message": "User deleted"
    }


@router.get("/")
def home():
    return {
        "message": "Pharmacy API Running"
    }
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
    db: Session = Depends(get_db),
    user=Depends(
        require_roles(
            "SUPER_ADMIN",
            "ADMIN"
        )
    )
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
    db: Session = Depends(get_db),
    user=Depends(
        require_roles(
            "SUPER_ADMIN",
            "ADMIN",
            "PHARMACIST",
            "WAREHOUSE_MANAGER",
            "CUSTOMER"
        )
    )
):
    return get_medicines_service(db)


@router.get("/medicines/download")
def download_medicines_csv(
    db: Session = Depends(get_db)
):

    medicines = db.query(Medicine).all()

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "name",
        "manufacturer",
        "price"
    ])

    for medicine in medicines:

        writer.writerow([
            medicine.name,
            medicine.manufacturer,
            medicine.price
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
            "attachment; filename=medicines.csv"
        }
    )

@router.get(
    "/medicines/{medicine_id}",
    response_model=MedicineResponse
)
def get_medicine(
    medicine_id: int,
    db: Session = Depends(get_db),
    user=Depends(
        require_roles(
            "SUPER_ADMIN",
            "ADMIN",
            "PHARMACIST",

            "CUSTOMER"
        )
    )
):
    return get_medicine_service(
        db,
        medicine_id
    )


@router.post("/medicines/upload")
async def upload_medicines(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    content = await file.read()

    csv_file = io.StringIO(
        content.decode("utf-8")
    )

    reader = csv.DictReader(csv_file)

    for row in reader:

        medicine = Medicine(
            name=row.get("name"),
            manufacturer=row.get("manufacturer"),
            price=float(
                row.get("price", 0)
            )
        )

        db.add(medicine)

    db.commit()

    return {
        "message": "Medicines uploaded successfully"
    }


@router.get("/warehouse/download")
def download_warehouse_csv(
    db: Session = Depends(get_db)
):

    warehouses = db.query(
        WarehouseStock
    ).all()

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "warehouse_id",
        "medicine_id",
        "stock_quantity"
    ])

    for warehouse in warehouses:

        writer.writerow([
            warehouse.warehouse_id,
            warehouse.medicine_id,
            warehouse.stock_quantity
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
            "attachment; filename=warehouse.csv"
        }
    )

@router.post(
    "/warehouse-stock",
    response_model=WarehouseStockResponse
)
def add_stock(
    stock: WarehouseStockCreate,
    db: Session = Depends(get_db),
    user=Depends(
        require_roles(
            "SUPER_ADMIN",
            "ADMIN",
            "WAREHOUSE_MANAGER"
        )
    )
):
    return add_stock_service(
        db,
        stock
    )

from app.subproject.warehouse.warehouse_model import WarehouseStock
from app.subproject.orders.order_model import Order

@router.post("/medicines/delete/{medicine_id}")
def delete_medicine(
    medicine_id: int,
    db: Session = Depends(get_db)
):

    # Delete warehouse stock records
    db.query(WarehouseStock).filter(
        WarehouseStock.medicine_id == medicine_id
    ).delete()

    # Delete order records
    db.query(Order).filter(
        Order.medicine_id == medicine_id
    ).delete()

    # Delete medicine
    medicine = (
        db.query(Medicine)
        .filter(Medicine.id == medicine_id)
        .first()
    )

    if medicine:
        db.delete(medicine)

    db.commit()

    return {
        "message": "Medicine deleted successfully"
    }
@router.post("/warehouse/delete/{stock_id}")
def delete_warehouse(
    stock_id: int,
    db: Session = Depends(get_db)
):

    stock = (
        db.query(WarehouseStock)
        .filter(WarehouseStock.id == stock_id)
        .first()
    )

    if stock:

        db.delete(stock)

        db.commit()

    return {
        "message": "Warehouse stock deleted"
    }
@router.get(
    "/warehouse-stock",
    response_model=list[WarehouseStockResponse]
)
def get_stocks(
    db: Session = Depends(get_db),
    user=Depends(
        require_roles(
            "SUPER_ADMIN",
            "ADMIN",
            "PHARMACIST",
            "WAREHOUSE_MANAGER"
        )
    )
):
    return get_stocks_service(db)


