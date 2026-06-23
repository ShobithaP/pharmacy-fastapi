from sqlalchemy import Column, Integer, String, Float
from config.db import Base


class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    manufacturer = Column(String(100), nullable=False)

    price = Column(Float, nullable=False)