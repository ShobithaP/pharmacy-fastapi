from fastapi import FastAPI

from app.subproject.api import router

from app.config.db import engine

from models import Base

Base.metadata.create_all(
    bind=engine
)

app = FastAPI(
    title="Pharmacy API"
)

app.include_router(
    router
)


@app.get("/")
def home():
    return {
        "message":
            "Pharmacy API Running"
    }


