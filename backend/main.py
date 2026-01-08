from fastapi import FastAPI
from database import Base, engine
from budgets import router as budgets_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Budget Tracker API")

app.include_router(budgets_router)
