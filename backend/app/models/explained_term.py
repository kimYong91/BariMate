from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class ExplainedTerm(Base):
    __tablename__ = "explained_terms"

    id = Column(Integer, primary_key=True, index=True)
    memo_id = Column(Integer, ForeignKey("memos.id"), nullable=False, index=True)
    ai_content = Column(Text, nullable=False)  # AI가 생성한 설명 내용
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 관계 설정
    memo = relationship("Memo", back_populates="explained_terms")

    def __repr__(self):
        return f"<ExplainedTerm(id={self.id}, memo_id={self.memo_id})>" 