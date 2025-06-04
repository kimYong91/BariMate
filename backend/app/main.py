from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from .database import engine, Base
from .routers.ai_router import router as ai_router
from .routers.memo_router import router as memo_router

# 모든 모델을 import해야 Base.metadata에 등록됨 (중요!)
from .models import user, memo, explained_term

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """앱 시작과 종료 시 실행되는 이벤트"""
    # 시작 시
    try:
        logger.info("🚀 BariMate API 서버 시작 중...")
        
        # 데이터베이스 테이블 생성
        Base.metadata.create_all(bind=engine)
        logger.info("✅ 데이터베이스 테이블이 생성되었습니다.")
        
        # 기본 사용자 생성 (개발 환경)
        from .seed_data import create_seed_data
        create_seed_data()
        logger.info("✅ 시드 데이터 생성이 완료되었습니다.")
        
        logger.info("🎉 BariMate API 서버 시작 완료!")
        
    except Exception as e:
        logger.error(f"❌ 데이터베이스 초기화 중 오류: {e}")
    
    yield  # 서버 실행 중
    
    # 종료 시
    logger.info("🛑 BariMate API 서버 종료 중...")


# FastAPI 앱 생성 (lifespan 이벤트 포함)
app = FastAPI(
    title="BariMate API",
    description="메모 관리 및 AI 설명 생성 서비스",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 설정 (프론트엔드와 통신을 위해)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite, React 개발 서버
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(ai_router, prefix="/api")
app.include_router(memo_router, prefix="/api")

# 기본 엔드포인트
@app.get("/")
async def root():
    """루트 엔드포인트 - API 상태 확인"""
    return {
        "message": "BariMate API 서버가 정상적으로 실행 중입니다!",
        "version": "1.0.0",
        "features": ["memo_management", "ai_explanation"]
    }

@app.get("/health")
async def health_check():
    """헬스체크 엔드포인트"""
    return {"status": "healthy", "service": "BariMate API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True) 