from pydantic import BaseModel


class WarehouseBase(BaseModel):
    warehouse_name: str
    stock_quantity: int
    location: str | None = None


class WarehouseCreate(WarehouseBase):
    pass


class WarehouseUpdate(WarehouseBase):
    id: int


class WarehouseDelete(BaseModel):
    id: int


class WarehouseResponse(BaseModel):
    id: int
    medicine_id: int
    warehouse_name: str
    location: str
    stock_quantity: int

    class Config:
        from_attributes = True