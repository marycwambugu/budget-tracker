from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import SessionLocal
from models import Budget

router = APIRouter(prefix="/budgets", tags=["Budgets"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class BudgetCreate(BaseModel):
    month: str
    category: str
    amount: float

# ✅ CREATE budget
@router.post("/")
def create_budget(
    budget: BudgetCreate,
    db: Session = Depends(get_db)
):
    new_budget = Budget(
        month=budget.month,
        category=budget.category,
        amount=budget.amount,
    )
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget

# ✅ GET budgets by month
@router.get("/")
def get_budgets(
    month: str,
    db: Session = Depends(get_db)
):
    return db.query(Budget).filter(Budget.month == month).all()

# ✅ DELETE budget by id  ← THIS WAS MISSING
@router.delete("/{budget_id}")
def delete_budget(
    budget_id: int,
    db: Session = Depends(get_db)
):
    budget = db.query(Budget).filter(Budget.id == budget_id).first()

    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")

    db.delete(budget)
    db.commit()

    return {"message": "Budget deleted"}
