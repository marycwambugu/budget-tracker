# 1) Imports we need
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import date, datetime

# 2) Import your DB session + Transaction model
from database import SessionLocal
from models import Transaction


# 3) Create a router for all /transactions endpoints
router = APIRouter(prefix="/transactions", tags=["transactions"])


# 4) Dependency: gives us a database session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 5) Pydantic schema for creating a transaction (what client sends)
class TransactionCreate(BaseModel):
    description: str
    amount: float
    category: str
    date: date          # expects "YYYY-MM-DD"
    type: str           # "income" or "expense"


# 6) Pydantic schema for returning a transaction (what API sends back)
class TransactionOut(TransactionCreate):
    id: int

    class Config:
        from_attributes = True  # allows SQLAlchemy -> Pydantic conversion


# 7) POST /transactions  -> create a new transaction
@router.post("", response_model=TransactionOut)
def create_transaction(payload: TransactionCreate, db: Session = Depends(get_db)):
    # Create a SQLAlchemy Transaction object from the request payload
    tx = Transaction(
        description=payload.description,
        amount=payload.amount,
        category=payload.category,
        date=payload.date,
        type=payload.type,
    )

    # Save to DB
    db.add(tx)
    db.commit()
    db.refresh(tx)

    # Return the created transaction (includes id)
    return tx


# 8) Helper: convert "YYYY-MM" into [start_date, end_date)
def month_range(month: str):
    """
    month: "YYYY-MM"
    returns: (start_date, end_date) where end_date is the 1st of the next month
    """
    try:
        start = datetime.strptime(month, "%Y-%m").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="month must be in format YYYY-MM")

    # compute first day of next month
    if start.month == 12:
        end = date(start.year + 1, 1, 1)
    else:
        end = date(start.year, start.month + 1, 1)

    return start, end


# 9) GET /transactions?month=YYYY-MM  -> list transactions (optionally by month)
@router.get("", response_model=list[TransactionOut])
def list_transactions(
    month: str | None = Query(default=None, description="Format: YYYY-MM"),
    db: Session = Depends(get_db),
):
    query = db.query(Transaction)

    # If month is provided, filter to that month
    if month:
        start, end = month_range(month)
        query = query.filter(Transaction.date >= start, Transaction.date < end)

    # Order newest first (optional but nice)
    results = query.order_by(Transaction.date.desc()).all()
    return results


# 10) DELETE /transactions/{id}  -> delete one transaction by id
@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    tx = db.query(Transaction).filter(Transaction.id == transaction_id).first()

    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(tx)
    db.commit()
    return {"ok": True, "deleted_id": transaction_id}
    