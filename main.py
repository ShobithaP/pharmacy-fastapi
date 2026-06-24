from fastapi import FastAPI, Depends, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import pandas as pd

from fastapi.middleware.cors import CORSMiddleware

from config.db import engine, get_db
from models import Base
from app.subproject.warehouse.warehouse_api import router as warehouse_router

from app.subproject.api import router
from app.subproject.auth_api import router as auth_router
from app.subproject.medicines.medicine_api import router as medicine_router
from app.subproject.medicines.medicine_model import Medicine
from app.subproject.warehouse.warehouse_model import WarehouseStock
Base.metadata.create_all(bind=engine)
from app.subproject.orders.order_api import (
    router as order_router
)

from fastapi import FastAPI

from app.middleware.logging_middleware import (
    LoggingMiddleware
)



app = FastAPI()

app.add_middleware(
    LoggingMiddleware
)
from app.middleware.auth_middleware import (
    AuthenticationMiddleware
)

from app.middleware.authorization_middleware import (
    AuthorizationMiddleware
)

app.add_middleware(
    AuthenticationMiddleware
)

app.add_middleware(
    AuthorizationMiddleware
)


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pharmacy API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://0.0.0.0:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)          # Only if api.py is still used
app.include_router(auth_router)
app.include_router(medicine_router)
app.include_router(order_router)

app.include_router(warehouse_router)

@app.get("/")
def home():
    return {"message": "Pharmacy API Running"}

@app.get("/search")
def search_data(
    search_by: str,
    search_text: str,
    db: Session = Depends(get_db)
):
    medicines = db.query(Medicine).all()

    records = []

    for medicine in medicines:
        if medicine.warehouse_stocks:
            for stock in medicine.warehouse_stocks:
                records.append(
                    {
                        "id": medicine.id,
                        "name": medicine.name,
                        "manufacturer": medicine.manufacturer,
                        "price": medicine.price,
                        "warehouse_id": stock.id,
                        "warehouse_name": stock.warehouse_name,
                        "location": stock.location,
                        "stock_quantity": stock.stock_quantity
                    }
                )
        else:
            records.append(
                {
                    "id": medicine.id,
                    "name": medicine.name,
                    "manufacturer": medicine.manufacturer,
                    "price": medicine.price,
                    "warehouse_id": None,
                    "warehouse_name": None,
                    "location": None,
                    "stock_quantity": None
                }
            )

    df = pd.DataFrame(records)

    if df.empty:
        return []

    if search_by.lower() != "all" and search_by not in df.columns:
        return {
            "error": "Invalid search field",
            "available_fields": list(df.columns)
        }

    if search_by.lower() == "all":
        result = df[
            df.astype(str)
            .apply(lambda col: col.str.contains(search_text, case=False, na=False))
            .any(axis=1)
        ]
    else:
        result = df[
            df[search_by]
            .astype(str)
            .str.contains(search_text, case=False, na=False)
        ]

    return result.to_dict(orient="records")

@app.get("/search/download")
def download_search(
    search_by: str,
    search_text: str,
    db: Session = Depends(get_db)
):
    medicines = db.query(Medicine).all()

    records = []

    for medicine in medicines:
        if medicine.warehouse_stocks:
            for stock in medicine.warehouse_stocks:
                records.append({
                    "id": medicine.id,
                    "name": medicine.name,
                    "manufacturer": medicine.manufacturer,
                    "price": medicine.price,
                    "warehouse_name": stock.warehouse_name,
                    "location": stock.location,
                    "stock_quantity": stock.stock_quantity
                })
        else:
            records.append({
                "id": medicine.id,
                "name": medicine.name,
                "manufacturer": medicine.manufacturer,
                "price": medicine.price,
                "warehouse_name": None,
                "location": None,
                "stock_quantity": None
            })

    df = pd.DataFrame(records)

    if search_by.lower() == "all":
        result = df[
            df.astype(str)
            .apply(lambda col: col.str.contains(search_text, case=False, na=False))
            .any(axis=1)
        ]
    else:
        result = df[
            df[search_by]
            .astype(str)
            .str.contains(search_text, case=False, na=False)
        ]

    csv_file = "search_results.csv"
    result.to_csv(csv_file, index=False)

    return FileResponse(
        path=csv_file,
        filename="search_results.csv",
        media_type="text/csv"
    )

@app.get("/medicines/download")
def download_medicines(db: Session = Depends(get_db)):
    try:
        medicines = db.query(Medicine).all()

        data = [
            {
                "id": m.id,
                "name": m.name,
                "manufacturer": m.manufacturer,
                "price": m.price
            }
            for m in medicines
        ]

        df = pd.DataFrame(data)

        csv_file = "medicines.csv"

        df.to_csv(
            csv_file,
            index=False
        )

        return FileResponse(
            path=csv_file,
            filename="medicines.csv",
            media_type="text/csv"
        )

    except Exception as e:
        return {
            "error": str(e)
        }
@app.post("/medicines/upload")
def upload_medicines(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    df = pd.read_csv(file.file)

    for _, row in df.iterrows():
        db.add(
            Medicine(
                name=row["name"],
                manufacturer=row["manufacturer"],
                price=row["price"]
            )
        )

    db.commit()

    return {"message": f"{len(df)} medicines inserted"}

@app.post("/warehouse/upload")
def upload_warehouse(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    df = pd.read_csv(file.file)

    for _, row in df.iterrows():
        db.add(
            WarehouseStock(
                medicine_id=row["medicine_id"],
                warehouse_name=row["warehouse_name"],
                location=row["location"],
                stock_quantity=row["stock_quantity"]
            )
        )

    db.commit()

    return {"message": f"{len(df)} warehouse records inserted"}