from pydantic import BaseModel


class WarehouseStockBase(BaseModel):
    warehouse_name: str
    location: str
    stock_quantity: int


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


class MedicineCreate(BaseModel):
    name: str
    manufacturer: str
    price: float


class MedicineResponse(BaseModel):
    id: int
    name: str
    manufacturer: str
    price: float

    class Config:
        from_attributes = True