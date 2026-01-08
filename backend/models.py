from sqlalchemy import Column, Integer, String, Float, Date
from database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    amount = Column(Float)
    category = Column(String)
    date = Column(Date)
    type = Column(String)  # "income" or "expense"
    