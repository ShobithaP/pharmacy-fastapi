from sqlalchemy.orm import Session

from models import Medicine


def create_medicine(
        db: Session,
        medicine
):
    db_medicine = Medicine(
        name=medicine.name,
        manufacturer=medicine.manufacturer,
        price=medicine.price
    )

    db.add(db_medicine)

    db.commit()

    db.refresh(db_medicine)

    return db_medicine


def get_all_medicines(
        db: Session
):
    medicines = db.query(
        Medicine
    ).all()

    return medicines
# Business logic functions go here
from models import WarehouseStock


def create_warehouse_stock(db, stock):

    db_stock = WarehouseStock(
        medicine_id=stock.medicine_id,
        warehouse_name=stock.warehouse_name,
        location=stock.location,
        stock_quantity=stock.stock_quantity
    )

    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)

    return db_stock


def get_all_stocks(db):

    return db.query(
        WarehouseStock
    ).all()


def get_medicine_by_id(
    db,
    medicine_id
):

    return db.query(
        Medicine
    ).filter(
        Medicine.id == medicine_id
    ).first()

