-- PostgreSQL 데이터베이스 초기화 스크립트
-- pgvector 확장 활성화 (벡터 검색 기능을 위해)
CREATE EXTENSION IF NOT EXISTS vector;

-- 더미 사용자 데이터 추가 (개발 초기 테스트용)
-- SQLAlchemy가 테이블을 자동 생성한 후에 실행되어야 하므로
-- 여기서는 확장 프로그램만 설치하고, 실제 데이터는 백엔드에서 시드 데이터로 추가 