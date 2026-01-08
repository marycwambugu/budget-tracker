from sqlalchemy import Column, Integer, String, Float
from database import Base

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, index=True)   # e.g. "2026-01"
    category = Column(String)
    amount = Column(Float)
