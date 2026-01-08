from fastapi import FastAPI
from database import engine, Base
from transactions import router as transactions_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(transactions_router)
