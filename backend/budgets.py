from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Budget

router = APIRouter(prefix="/budgets", tags=["Budgets"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_budget(month: str, category: str, amount: float, db: Session = Depends(get_db)):
    budget = Budget(month=month, category=category, amount=amount)
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget

@router.get("/")
def get_budgets(month: str, db: Session = Depends(get_db)):
    return db.query(Budget).filter(Budget.month == month).all()
