from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from config.db import Base


class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100))

    manufacturer = Column(String(100))

    price = Column(Float)

    warehouse_stocks = relationship(
        "WarehouseStock",
        back_populates="medicine"
    )


class WarehouseStock(Base):
    __tablename__ = "warehouse_stock"

    id = Column(Integer, primary_key=True, index=True)

    medicine_id = Column(
        Integer,
        ForeignKey("medicines.id")
    )

    warehouse_name = Column(String(100))

    location = Column(String(100))

    stock_quantity = Column(Integer)

    medicine = relationship(
        "Medicine",
        back_populates="warehouse_stocks"
    )
# Add your SQLAlchemy models here
