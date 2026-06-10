from pydantic import BaseModel


class WarehouseStockBase(BaseModel):
    warehouse_name: str

    location: str

    stock_quantity: int


class WarehouseStockResponse(
    WarehouseStockBase
):
    class Config:
        from_attributes = True


class MedicineCreate(BaseModel):
    name: str

    manufacturer: str

    price: float


class MedicineResponse(
    MedicineCreate
):
    id: int

    warehouse_stocks: list[
        WarehouseStockResponse
    ] = []

    class Config:
        from_attributes = True
# Pydantic schemas go here
from pydantic import BaseModel


class WarehouseStockCreate(BaseModel):
    medicine_id: int
    warehouse_name: str
    location: str
    stock_quantity: int


class WarehouseStockResponse(BaseModel):
    id: int
    medicine_id: int
    warehouse_name: str
    location: str
    stock_quantity: int

    class Config:
        from_attributes = True