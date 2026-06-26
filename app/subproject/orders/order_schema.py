from pydantic import BaseModel



from pydantic import BaseModel


class OrderCreate(BaseModel):

    medicine_id: int

    quantity: int

    pharmacist_id: int | None = None

    order_type: str = "CUSTOMER"
    warehouse_id: int | None = None

class OrderResponse(BaseModel):

    id: int

    user_id: int

    pharmacist_id: int | None = None

    medicine_id: int

    quantity: int

    status: str

    order_type: str
    warehouse_id: int | None = None
    class Config:
        from_attributes = True

