from sqlalchemy import Column, Integer, String
from config.db import Base


class WarehouseStock(Base):
    __tablename__ = "warehouse_stock"

    id = Column(Integer, primary_key=True, index=True)

    medicine_id = Column(Integer, nullable=False)

    warehouse_name = Column(String(255), nullable=False)

    location = Column(String(255), nullable=True)

    stock_quantity = Column(Integer, nullable=False)