from fastapi import HTTPException

from app.subproject.utility import (
    create_medicine,
    get_all_medicines,
    get_medicine_by_id,
    create_warehouse_stock,
    get_all_stocks
)


def add_medicine_service(
    db,
    medicine
):
    return create_medicine(
        db,
        medicine
    )


def get_medicines_service(
    db
):
    return get_all_medicines(
        db
    )


def get_medicine_service(
    db,
    medicine_id
):
    medicine = get_medicine_by_id(
        db,
        medicine_id
    )

    if not medicine:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found"
        )

    return medicine


def add_stock_service(
    db,
    stock
):
    medicine = get_medicine_by_id(
        db,
        stock.medicine_id
    )

    if not medicine:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found"
        )

    return create_warehouse_stock(
        db,
        stock
    )


def get_stocks_service(
    db
):
    return get_all_stocks(
        db
    )