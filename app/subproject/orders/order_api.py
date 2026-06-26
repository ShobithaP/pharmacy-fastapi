from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from config.db import get_db
from models import User
from app.subproject.warehouse.warehouse_model import WarehouseStock
from app.subproject.dependencies import get_current_user
from app.subproject.orders.order_model import Order
from app.subproject.orders.order_schema import OrderCreate
from app.subproject.pharmacist_inventory_model import (
    PharmacistInventory
)
from app.subproject.medicines.medicine_model import Medicine

router = APIRouter(
    tags=["Orders"]
)

@router.post("/orders")
def place_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):

    order_type = (
        "BULK"
        if user.role.name == "PHARMACIST"
        else "CUSTOMER"
    )

    if order_type == "BULK":

        warehouse_stock = (
            db.query(WarehouseStock)
            .filter(
                WarehouseStock.id
                == order.warehouse_id
            )
            .first()
        )

        if not warehouse_stock:
            return {
                "message":
                "Warehouse stock not found"
            }

        if (
            order.quantity >
            warehouse_stock.stock_quantity
        ):
            return {
                "message":
                f"Entered quantity is unavailable. Available stock: {warehouse_stock.stock_quantity}"
            }

    new_order = Order(
        user_id=user.id,
        medicine_id=order.medicine_id,
        quantity=order.quantity,
        order_type=order_type,
        pharmacist_id=order.pharmacist_id,
        warehouse_id=order.warehouse_id
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return {
        "id": new_order.id,
        "user_id": new_order.user_id,
        "pharmacist_id": new_order.pharmacist_id,
        "medicine_id": new_order.medicine_id,
        "quantity": new_order.quantity,
        "status": new_order.status,
        "order_type": new_order.order_type,
        "warehouse_id": new_order.warehouse_id
    }
@router.get("/orders")
def get_orders(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):

    if user.role.name == "CUSTOMER":

        orders = (
            db.query(Order)
            .filter(
                Order.user_id == user.id
            )
            .all()
        )

    elif user.role.name == "PHARMACIST":

        orders = (
            db.query(Order)
            .filter(
                or_(
                    Order.pharmacist_id == user.id,
                    and_(
                        Order.user_id == user.id,
                        Order.order_type == "BULK"
                    )
                )
            )
            .all()
        )

    else:

        orders = (
            db.query(Order)
            .all()
        )

    result = []

    for order in orders:

        medicine = (
            db.query(Medicine)
            .filter(
                Medicine.id == order.medicine_id
            )
            .first()
        )

        result.append(
            {
                "id": order.id,
                "user_id": order.user_id,
                "pharmacist_id": order.pharmacist_id,
                "medicine_id": order.medicine_id,
                "medicine_name": (
                    medicine.name
                    if medicine
                    else "Unknown Medicine"
                ),
                "quantity": order.quantity,
                "status": order.status,
                "order_type": order.order_type,
                "warehouse_id": order.warehouse_id
            }
        )

    return result
@router.post("/orders/approve/{order_id}")
def approve_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        return {
            "message": "Order not found"
        }

    if order.order_type == "CUSTOMER":

        inventory = (
            db.query(
                PharmacistInventory
            )
            .filter(
                PharmacistInventory.medicine_id
                == order.medicine_id
            )
            .first()
        )

        if not inventory:
            return {
                "message":
                "Medicine not found in pharmacist inventory"
            }

        if inventory.quantity < order.quantity:
            return {
                "message":
                "Insufficient pharmacist stock"
            }

        inventory.quantity -= order.quantity
    elif order.order_type == "BULK":

        warehouse_stock = (
            db.query(WarehouseStock)
            .filter(
                WarehouseStock.id ==
                order.warehouse_id
            )
            .first()
        )

        if not warehouse_stock:
            return {
                "message":
                    "Warehouse stock not found"
            }

        if (
                warehouse_stock.stock_quantity <
                order.quantity
        ):
            return {
                "message":
                    f"Insufficient warehouse stock. Available: {warehouse_stock.stock_quantity}"
            }

        warehouse_stock.stock_quantity -= (
            order.quantity
        )

    order.status = "APPROVED"

    db.commit()

    return {
        "message":
        "Order approved and inventory updated"
    }


@router.post("/orders/delete/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):

    if user.role.name != "SUPER_ADMIN":

        return {
            "message":
            "Only Super Admin can delete orders"
        }

    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:

        return {
            "message":
            "Order not found"
        }

    db.delete(order)
    db.commit()

    return {
        "message":
        "Order deleted successfully"
    }