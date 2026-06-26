from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from datetime import datetime

from config.db import Base


class Order(Base):

    __tablename__ = "orders"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    pharmacist_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )
    medicine_id = Column(
        Integer,
        ForeignKey("medicines.id")
    )
    warehouse_id = Column(
        Integer,
        nullable=True
    )

    quantity = Column(
        Integer,
        nullable=False
    )

    status = Column(
        String,
        default="PENDING"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    order_type = Column(
        String,
        default="CUSTOMER"
    )