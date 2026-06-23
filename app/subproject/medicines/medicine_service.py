from sqlalchemy.orm import Session

from app.subproject.medicines.medicine_model import Medicine


class MedicineService:

    @staticmethod
    def create_medicine(db: Session, request):

        medicine = Medicine(
            name=request.name,
            generic_name=request.generic_name,
            category=request.category,
            brand=request.brand,
            batch_number=request.batch_number,
            expiry_date=request.expiry_date,
            quantity=request.quantity,
            buy_price=request.buy_price,
            sell_price=request.sell_price,
            warehouse_id=request.warehouse_id,
        )

        db.add(medicine)
        db.commit()
        db.refresh(medicine)

        return {
            "message": "Medicine created successfully",
            "data": medicine
        }

    @staticmethod
    def get_all_medicines(db: Session):
        return db.query(Medicine).all()