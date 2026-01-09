from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from pydantic import BaseModel
from sqlalchemy import func

from database import SessionLocal
from models import Transaction

router = APIRouter()


# ---------- DB dependency ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Pydantic input model ----------
class TransactionCreate(BaseModel):
    description: str
    amount: float
    category: str
    date: date
    type: str  # "income" or "expense"


# ---------- helpers ----------
def tx_to_dict(t: Transaction):
    return {
        "id": t.id,
        "description": t.description,
        "amount": float(t.amount),
        "category": t.category,
        "date": str(t.date),
        "type": t.type,
    }


# ---------- routes ----------
@router.get("/transactions")
def list_transactions(db: Session = Depends(get_db)):
    txs = db.query(Transaction).order_by(Transaction.id.desc()).all()
    return [tx_to_dict(t) for t in txs]


@router.post("/transactions")
def create_transaction(payload: TransactionCreate, db: Session = Depends(get_db)):
    if payload.type not in ["income", "expense"]:
        raise HTTPException(status_code=400, detail="type must be 'income' or 'expense'")

    tx = Transaction(
        description=payload.description,
        amount=payload.amount,
        category=payload.category,
        date=payload.date,
        type=payload.type,
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx_to_dict(tx)


@router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    tx = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(tx)
    db.commit()
    return {"ok": True}


@router.get("/transactions/summary")
def summary(db: Session = Depends(get_db)):
    income = (
        db.query(func.sum(Transaction.amount))
        .filter(Transaction.type == "income")
        .scalar()
        or 0
    )

    expenses = (
        db.query(func.sum(Transaction.amount))
        .filter(Transaction.type == "expense")
        .scalar()
        or 0
    )

    by_category_rows = (
        db.query(Transaction.category, func.sum(Transaction.amount))
        .filter(Transaction.type == "expense")
        .group_by(Transaction.category)
        .all()
    )

    return {
        "total_income": float(income),
        "total_expenses": float(expenses),
        "net": float(income) - float(expenses),
        "spending_by_category": [
            {"category": cat, "total": float(total)}
            for cat, total in by_category_rows
        ],
    }
    