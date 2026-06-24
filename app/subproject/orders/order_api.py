from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config.db import get_db
from models import User

from app.subproject.dependencies import get_current_user
from app.subproject.orders.order_model import Order
from app.subproject.orders.order_schema import OrderCreate

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

    new_order = Order(
        user_id=user.id,
        medicine_id=order.medicine_id,
        quantity=order.quantity,
        order_type=order_type
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return {
        "id": new_order.id,
        "user_id": new_order.user_id,
        "medicine_id": new_order.medicine_id,
        "quantity": new_order.quantity,
        "status": new_order.status,
        "order_type": new_order.order_type
    }


@router.get("/orders")
def get_orders(
    db: Session = Depends(get_db)
):

    orders = db.query(Order).all()

    return [
        {
            "id": order.id,
            "user_id": order.user_id,
            "medicine_id": order.medicine_id,
            "quantity": order.quantity,
            "status": order.status,
            "order_type": order.order_type
        }
        for order in orders
    ]


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

    order.status = "APPROVED"

    db.commit()

    return {
        "message": "Order approved"
    }
@router.post("/orders/delete/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):

    if user.role.name != "SUPER_ADMIN":

        return {
            "message": "Only Super Admin can delete orders"
        }

    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:

        return {
            "message": "Order not found"
        }

    db.delete(order)

    db.commit()

    return {
        "message": "Order deleted successfully"
    }
@router.post("/orders/delete/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):

    if user.role.name != "SUPER_ADMIN":
        return {
            "message": "Only Super Admin can delete orders"
        }

    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        return {
            "message": "Order not found"
        }

    db.delete(order)
    db.commit()

    return {
        "message": "Order deleted successfully"
    }