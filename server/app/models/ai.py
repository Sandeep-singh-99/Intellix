from sqlalchemy import Boolean, Column, Integer, String, DateTime, Table, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.config.db import Base
from datetime import datetime
import uuid


class AI(Base):
    __tablename__ = "ais"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_ques = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="ais")