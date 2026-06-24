from pydantic import BaseModel



class OrderCreate(BaseModel):
    medicine_id: int
    quantity: int
    order_type: str = "CUSTOMER"

class OrderResponse(BaseModel):
    id: int
    user_id: int
    medicine_id: int
    quantity: int
    status: str

    class Config:
        from_attributes = True
