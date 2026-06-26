from sqlalchemy import (
    Column,
    Integer,
    ForeignKey
)

from config.db import Base


class PharmacistInventory(Base):

    __tablename__ = "pharmacist_inventory"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    medicine_id = Column(
        Integer,
        ForeignKey("medicines.id")
    )

    quantity = Column(
        Integer,
        nullable=False,
        default=0
    )