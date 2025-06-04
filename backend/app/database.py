import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 환경변수에서 데이터베이스 URL 가져오기
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/barimate")

# SQLAlchemy 엔진 생성
engine = create_engine(DATABASE_URL)

# 세션 생성기 설정
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base 클래스 생성
Base = declarative_base()

# 데이터베이스 세션 의존성 함수
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 