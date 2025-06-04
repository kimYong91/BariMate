from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Memo(Base):
    __tablename__ = "memos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    category = Column(String(50), nullable=False)  # 예: "수업노트", "공부메모", "아이디어" 등
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 관계 설정
    user = relationship("User", back_populates="memos")
    explained_terms = relationship("ExplainedTerm", back_populates="memo", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Memo(id={self.id}, title='{self.title}', category='{self.category}')>" 