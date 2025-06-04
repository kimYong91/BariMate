from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from pydantic import BaseModel
import logging

from ..database import get_db
from ..models.memo import Memo
from ..models.user import User

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/memos", tags=["Memos"])

# 요청/응답 모델
class MemoCreate(BaseModel):
    title: str
    category: str
    content: str
    user_id: int = 1  # 개발 단계에서는 고정

class MemoResponse(BaseModel):
    id: int
    title: str
    category: str
    content: str
    user_id: int
    created_at: str
    updated_at: str

@router.post("/", response_model=Dict[str, Any])
async def create_memo(
    memo: MemoCreate,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    새로운 메모 생성
    """
    try:
        # 사용자 존재 확인
        user = db.query(User).filter(User.id == memo.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"사용자 ID {memo.user_id}를 찾을 수 없습니다."
            )
        
        # 메모 생성
        db_memo = Memo(
            user_id=memo.user_id,
            title=memo.title,
            category=memo.category,
            content=memo.content
        )
        
        db.add(db_memo)
        db.commit()
        db.refresh(db_memo)
        
        logger.info(f"새 메모 생성 완료: ID {db_memo.id}, 제목: {db_memo.title}")
        
        return {
            "success": True,
            "message": "메모가 성공적으로 생성되었습니다.",
            "memo": {
                "id": db_memo.id,
                "title": db_memo.title,
                "category": db_memo.category,
                "content": db_memo.content,
                "user_id": db_memo.user_id,
                "created_at": db_memo.created_at.isoformat(),
                "updated_at": db_memo.updated_at.isoformat()
            }
        }
        
    except Exception as e:
        logger.error(f"메모 생성 중 오류: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"메모 생성 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/", response_model=List[Dict[str, Any]])
async def get_memos(
    user_id: int = 1,  # 쿼리 파라미터로 사용자 ID (기본값 1)
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    """
    사용자의 모든 메모 조회
    """
    try:
        memos = db.query(Memo).filter(Memo.user_id == user_id).order_by(Memo.created_at.desc()).all()
        
        return [
            {
                "id": memo.id,
                "title": memo.title,
                "category": memo.category,
                "content": memo.content,
                "user_id": memo.user_id,
                "created_at": memo.created_at.isoformat(),
                "updated_at": memo.updated_at.isoformat()
            }
            for memo in memos
        ]
        
    except Exception as e:
        logger.error(f"메모 조회 중 오류: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"메모 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/{memo_id}", response_model=Dict[str, Any])
async def get_memo(
    memo_id: int,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    특정 메모 조회
    """
    memo = db.query(Memo).filter(Memo.id == memo_id).first()
    
    if not memo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID {memo_id}인 메모를 찾을 수 없습니다."
        )
    
    return {
        "id": memo.id,
        "title": memo.title,
        "category": memo.category,
        "content": memo.content,
        "user_id": memo.user_id,
        "created_at": memo.created_at.isoformat(),
        "updated_at": memo.updated_at.isoformat()
    } 