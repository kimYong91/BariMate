from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
import logging

from ..database import get_db
from ..models.memo import Memo
from ..models.explained_term import ExplainedTerm
from ..services.ai_service import ai_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/explain-memo/{memo_id}")
async def explain_memo(
    memo_id: int,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    메모 내용을 AI로 설명하고 결과를 저장하는 엔드포인트
    
    Args:
        memo_id: 설명할 메모의 ID
        db: 데이터베이스 세션
        
    Returns:
        AI 설명 결과와 메타 정보
    """
    
    # AI 서비스 사용 가능 여부 확인
    if not ai_service.is_available():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI 서비스를 사용할 수 없습니다. API 키를 확인해주세요."
        )
    
    # 메모 조회
    memo = db.query(Memo).filter(Memo.id == memo_id).first()
    if not memo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID {memo_id}인 메모를 찾을 수 없습니다."
        )
    
    try:
        # AI 설명 생성
        logger.info(f"메모 ID {memo_id}에 대한 AI 설명 생성 시작")
        ai_explanation = await ai_service.explain_memo(
            memo_content=memo.content,
            memo_title=memo.title,
            memo_category=memo.category
        )
        
        if not ai_explanation:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="AI 설명을 생성할 수 없습니다."
            )
        
        # 기존 설명이 있는지 확인
        existing_explanation = db.query(ExplainedTerm).filter(
            ExplainedTerm.memo_id == memo_id
        ).first()
        
        if existing_explanation:
            # 기존 설명 업데이트
            existing_explanation.ai_content = ai_explanation
            db.commit()
            db.refresh(existing_explanation)
            explained_term = existing_explanation
            action = "updated"
        else:
            # 새로운 설명 생성
            explained_term = ExplainedTerm(
                memo_id=memo_id,
                ai_content=ai_explanation
            )
            db.add(explained_term)
            db.commit()
            db.refresh(explained_term)
            action = "created"
        
        logger.info(f"메모 ID {memo_id}에 대한 AI 설명 {action} 완료")
        
        return {
            "success": True,
            "action": action,
            "explained_term": {
                "id": explained_term.id,
                "memo_id": explained_term.memo_id,
                "ai_content": explained_term.ai_content,
                "created_at": explained_term.created_at.isoformat(),
                "updated_at": explained_term.updated_at.isoformat()
            },
            "memo": {
                "id": memo.id,
                "title": memo.title,
                "category": memo.category,
                "content": memo.content
            }
        }
        
    except Exception as e:
        logger.error(f"메모 ID {memo_id} AI 설명 생성 중 오류: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"설명 생성 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/explain-memo/{memo_id}")
async def get_memo_explanation(
    memo_id: int,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    메모의 AI 설명을 조회하는 엔드포인트
    
    Args:
        memo_id: 조회할 메모의 ID
        db: 데이터베이스 세션
        
    Returns:
        메모와 AI 설명 정보
    """
    
    # 메모 조회
    memo = db.query(Memo).filter(Memo.id == memo_id).first()
    if not memo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID {memo_id}인 메모를 찾을 수 없습니다."
        )
    
    # AI 설명 조회
    explanation = db.query(ExplainedTerm).filter(
        ExplainedTerm.memo_id == memo_id
    ).first()
    
    return {
        "memo": {
            "id": memo.id,
            "title": memo.title,
            "category": memo.category,
            "content": memo.content,
            "created_at": memo.created_at.isoformat(),
            "updated_at": memo.updated_at.isoformat()
        },
        "explanation": {
            "id": explanation.id,
            "ai_content": explanation.ai_content,
            "created_at": explanation.created_at.isoformat(),
            "updated_at": explanation.updated_at.isoformat()
        } if explanation else None,
        "ai_available": ai_service.is_available()
    }


@router.get("/status")
async def ai_service_status() -> Dict[str, Any]:
    """
    AI 서비스 상태를 확인하는 엔드포인트
    
    Returns:
        AI 서비스 상태 정보
    """
    return {
        "ai_available": ai_service.is_available(),
        "service": "Gemini AI",
        "features": ["memo_explanation", "text_generation"]
    } 