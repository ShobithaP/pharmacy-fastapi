from sqlalchemy.orm import Session

from app.subproject.warehouse.warehouse_model import WarehouseStock


class WarehouseService:

    @staticmethod
    def get_all(db: Session):
        return db.query(WarehouseStock).all()

    @staticmethod
    def get_by_id(db: Session, warehouse_id: int):
        return db.query(WarehouseStock).filter(
            WarehouseStock.id == warehouse_id
        ).first()

    @staticmethod
    def create(db: Session, warehouse):
        obj = WarehouseStock(**warehouse.model_dump())
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @staticmethod
    def update(db: Session, warehouse_id: int, warehouse):
        obj = db.query(WarehouseStock).filter(
            WarehouseStock.id == warehouse_id
        ).first()

        if not obj:
            return None

        for key, value in warehouse.model_dump().items():
            setattr(obj, key, value)

        db.commit()
        db.refresh(obj)
        return obj

    @staticmethod
    def delete(db: Session, warehouse_id: int):
        obj = db.query(WarehouseStock).filter(
            WarehouseStock.id == warehouse_id
        ).first()

        if not obj:
            return False

        db.delete(obj)
        db.commit()
        return True