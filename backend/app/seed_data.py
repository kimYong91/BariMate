"""
더미 데이터 생성 스크립트 - 사용자만 생성
실제 메모는 사용자가 직접 입력해서 AI 테스트
"""

from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from .models.user import User

def create_seed_data():
    """더미 사용자만 생성"""
    db = SessionLocal()
    
    try:
        # 기존 사용자가 있는지 확인
        existing_user = db.query(User).filter(User.id == 1).first()
        if existing_user:
            print("더미 사용자가 이미 존재합니다.")
            return
        
        # 더미 사용자 생성
        dummy_user = User(
            name="테스트 사용자",
            firebase_uid=None  # 개발 단계에서는 null
        )
        db.add(dummy_user)
        db.commit()
        db.refresh(dummy_user)
        
        print(f"더미 사용자 생성 완료!")
        print(f"- 사용자: {dummy_user.name} (ID: {dummy_user.id})")
        print("이제 메모 생성 페이지에서 실제 메모를 입력하고 AI 테스트를 해보세요!")
        
    except Exception as e:
        print(f"더미 사용자 생성 중 오류: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_seed_data() 