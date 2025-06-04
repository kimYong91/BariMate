# BariMate 애플리케이션 개발 계획서

**목표:** AI 기반 용어 설명 및 상호 연결 기능을 갖춘 **PWA(Progressive Web App) 형태의** 메모 애플리케이션 개발 (PostgreSQL + FastAPI 중심의 하이브리드 아키텍처, Firebase 서비스 선택적 활용)

**주요 기술 스택:**
*   **프론트엔드 (Frontend):** React, TypeScript
    *   **PWA 구현:** 서비스 워커, 웹 매니페스트
    *   **주요 npm 패키지 예상 (frontend/ 디렉토리):**
        *   `react`, `react-dom`: React 라이브러리 (UI 구축 핵심)
        *   `typescript`: 타입스크립트 지원 (개발 의존성)
        *   `firebase`: Firebase 클라이언트 SDK (Authentication, Storage, Hosting 연동)
        *   `axios` (또는 `fetch` API): FastAPI 백엔드 API 호출
        *   `react-router-dom`: 클라이언트 사이드 라우팅
        *   (선택적) UI 라이브러리 (예: `tailwindcss`)
        *   (선택적) 상태 관리 라이브러리 (예: `zustand`)
        *   (선택적) `uuid`: 클라이언트 사이드 임시 고유 ID 생성

*   **백엔드 (Backend - `backend/` 디렉토리):** Python, FastAPI
    *   **주요 역할:** 핵심 비즈니스 로직 처리, API 엔드포인트 제공, AI 모델 연동 및 고급 처리, 복잡한 데이터 관리 및 검색 로직.
    *   **데이터베이스:** PostgreSQL with pgvector (핵심 데이터, 임베딩 벡터, 관계형 데이터) - `barimate` 규칙에 따라 Docker로 관리.
    *   **주요 Python 패키지 예상 (`backend/requirements.txt`):**
        *   `fastapi`: API 프레임워크
        *   `uvicorn`: ASGI 서버
        *   `pydantic`: 데이터 유효성 검사 및 설정 관리
        *   `sqlalchemy` (또는 선택한 ORM/Query Builder): PostgreSQL 연동
        *   `psycopg2-binary` (또는 `asyncpg` for async): PostgreSQL 드라이버
        *   `pgvector`: pgvector 지원 라이브러리 (SQLAlchemy 연동 등)
        *   `python-jose[cryptography]`, `passlib[bcrypt]`: JWT 인증 및 비밀번호 해싱 (`barimate` 규칙)
        *   `firebase-admin`: Firebase ID 토큰 검증용
        *   `google-generativeai` (또는 관련 Google AI SDK): Gemini API 연동
        *   `sentence-transformers` (또는 유사 라이브러리): 텍스트 임베딩 생성 (서버 사이드)

*   **클라우드 서비스 (Firebase - 선택적 활용):**
    *   **Firebase Authentication:** 사용자 인증 (이메일/비밀번호, 소셜 로그인) - 프론트엔드에서 직접 연동, FastAPI 백엔드에서 토큰 검증.
    *   **Cloud Storage for Firebase:** 사용자 업로드 파일 저장 (예: 설명에 첨부된 이미지) - 프론트엔드에서 직접 업로드 또는 FastAPI 백엔드를 통한 업로드, URL을 PostgreSQL에 저장.
    *   **Firebase Hosting:** PWA 웹 애플리케이션 배포 (CDN, SSL, 커스텀 도메인).
    *   **(선택적) Cloud Functions for Firebase (제한적 역할):**
        *   Firebase 서비스 간의 간단한 트리거 및 연동 로직 (예: Auth 사용자 생성 시 알림 등).
        *   Firebase Cloud Messaging (FCM)을 이용한 푸시 알림 전송 로직.
        *   (주의) 복잡한 비즈니스 로직, 핵심 데이터 처리는 FastAPI 백엔드가 담당.

*   **AI 모델:** Google Gemini API (FastAPI 백엔드를 통해 호출 및 관리)

*   **개발 및 배포 도구:**
    *   **Frontend/Backend:** Docker, Docker Compose (`docker-compose.yml`에 `backend`, `db` 서비스 정의)
    *   **Firebase:** Firebase CLI, Firebase Emulator Suite (Authentication, Storage, Hosting, 제한적인 Functions 로컬 테스트)
    *   **주요 npm 패키지 (전역 또는 개발 환경):** `firebase-tools`

**참고 문서:**
*   `PAGE_LIST.md`: 화면 목록 및 구성
*   `FUNCTIONAL_REQUIREMENTS.md`: 기능 요구사항 명세 (하이브리드 아키텍처 반영)
*   `PROJECT_OVERVIEW.md`: 프로젝트 개요 (하이브리드 아키텍처 반영)
*   `barimate` (프로젝트 규칙): 핵심 개발 가이드라인

---

## 단계별 개발 계획

### 페이즈 1: 기본 골격 구축 (PWA, FastAPI 백엔드, PostgreSQL, Firebase 인증)

#### 단계 1.1: 프로젝트 설정 (FastAPI, React, PostgreSQL, Firebase 인증)
*   **세부 작업:**
    1.  `backend/` (FastAPI), `frontend/` (React) 디렉토리 구조 생성 (`barimate` 규칙 준수).
    2.  `docker-compose.yml` 설정: `backend` (FastAPI), `db` (PostgreSQL/pgvector) 서비스 정의.
    3.  `backend/Dockerfile`, `frontend/Dockerfile` 기본 구성.
    4.  Firebase 콘솔에서 새 프로젝트 생성 및 웹 앱 추가. Firebase Authentication 설정. Firebase SDK 설정 코드를 프론트엔드에 적용.
    5.  **FastAPI 백엔드:** 기본 "Hello World" 엔드포인트 및 PostgreSQL 연결 테스트.
        *   **관련 Python 패키지(backend):** `fastapi`, `uvicorn`, `sqlalchemy`, `psycopg2-binary`
    6.  **프론트엔드 (React):** 기본 UI 구성, FastAPI 백엔드 "Hello World" API 호출 테스트.
        *   **관련 npm 패키지(frontend):** `react`, `react-dom`, `typescript`, `axios`
    7.  **PWA 기본 설정:** 웹 앱 매니페스트, 서비스 워커 기본 파일 생성 (프론트엔드).
    8.  Firebase 에뮬레이터 스위트 설정 (Authentication 로컬 테스트용).
        *   **관련 npm 패키지(전역/개발):** `firebase-tools`
*   **AI 활용 포인트:** FastAPI 기본 프로젝트 구조, Dockerfile 및 docker-compose.yml 설정, React 기본 컴포넌트, Firebase Authentication SDK 초기화 코드 생성 요청.

#### 단계 1.2: 사용자 인증 기능 구현 (Firebase Auth & FastAPI 연동)
*   **세부 작업:**
    1.  **프론트엔드 (React):**
        *   Firebase Authentication SDK를 사용하여 회원가입, 로그인, 로그아웃 UI 및 로직 구현.
        *   로그인 성공 시 Firebase ID 토큰 획득.
            *   **관련 npm 패키지(frontend):** `firebase` (Authentication 모듈)
    2.  **FastAPI 백엔드:**
        *   프론트엔드로부터 받은 Firebase ID 토큰을 검증하는 API 엔드포인트 및 미들웨어 구현.
        *   검증된 사용자에 대해 내부 사용자 정보 관리 (PostgreSQL `users` 테이블).
            *   **관련 Python 패키지(backend):** `firebase-admin` (Firebase ID 토큰 검증), `passlib[bcrypt]`, `python-jose[cryptography]` (내부 세션/토큰 관리 시)
*   **AI 활용 포인트:** Firebase Auth 연동 React 컴포넌트, FastAPI에서 Firebase ID 토큰 검증 로직, PostgreSQL 사용자 모델 생성 요청.

#### 단계 1.3: 기본 텍스트 메모 CRUD 기능 구현 (FastAPI & PostgreSQL)
*   **세부 작업:**
    1.  **데이터 모델링 (PostgreSQL):**
        *   `users` 테이블 (확장), `memos` 테이블 (내용, 태그, 카테고리, 중요도, 생성/수정일, 사용자 ID 등).
    2.  **FastAPI 백엔드:**
        *   메모 생성, 읽기(목록/상세), 수정, 삭제를 위한 CRUD API 엔드포인트 구현.
        *   인증된 사용자만 자신의 메모에 접근하도록 권한 제어.
            *   **관련 Python 패키지(backend):** `fastapi`, `sqlalchemy`
    3.  **프론트엔드 (React):**
        *   메모 작성/편집 UI, 메모 목록/상세 UI.
        *   FastAPI 백엔드 API를 호출하여 메모 CRUD 기능 연동.
            *   **관련 npm 패키지(frontend):** `axios`
*   **AI 활용 포인트:** PostgreSQL 테이블 스키마(SQLAlchemy 모델), FastAPI CRUD 엔드포인트 로직, React 관련 UI 컴포넌트 및 API 호출 로직 생성 요청.

---

### 페이즈 2: AI 기반 용어 정리 및 링크 추천 기능 구현 (FastAPI & PostgreSQL 중심)

#### 단계 2.1: AI 기반 용어 설명 생성 (FR-006) - FastAPI & Gemini API

**프로토타입 단계: FastAPI - Gemini API 직접 연동 테스트**

*   **목표:** FastAPI 백엔드에서 외부 API(Gemini)를 호출하여 용어 설명을 성공적으로 받아오는지 확인하는 최소 기능 프로토타입 구현.
*   **세부 작업 (프로토타입):**
    1.  **FastAPI 엔드포인트 생성 (백엔드):**
        *   `/api/v1/terms/explain-prototype` (또는 유사한 경로)와 같이 임시 또는 테스트용 엔드포인트 생성.
        *   요청 바디(Request Body)로 설명할 '용어(term)' 와 (선택적) '주제(topic)' 또는 '맥락(context)'을 문자열 형태로 받도록 Pydantic 모델 정의.
    2.  **Gemini API 연동 로직 (백엔드):**
        *   `google-generativeai` 라이브러리 설정 및 API 키 관리 방법 고려 (예: 환경 변수).
        *   입력받은 '용어'와 '주제/맥락'을 바탕으로 Gemini API에 전달할 프롬프트 구성 (필요시 `backend/prompts.py` 활용).
        *   Gemini API를 호출하여 용어 설명 요청.
        *   API 응답(설명 텍스트)을 파싱하여 추출.
    3.  **결과 반환 (백엔드):**
        *   Gemini API로부터 받은 설명을 JSON 형태로 클라이언트에게 즉시 반환.
    4.  **간단한 테스트 (백엔드):**
        *   HTTP 클라이언트(예: `curl`, Postman, FastAPI Swagger UI)를 사용하여 위 엔드포인트에 직접 요청을 보내고, 예상대로 Gemini API의 설명이 반환되는지 확인.
        *   오류 처리 (예: Gemini API 호출 실패 시 적절한 HTTP 에러 응답) 기본 구현.
*   **AI 활용 포인트 (프로토타입):** FastAPI 엔드포인트 기본 구조, Pydantic 모델, `google-generativeai` SDK 사용 예제, 기본 오류 처리 로직 생성 요청.

---

**본 기능 구현 단계 (프로토타입 이후):**

*   **세부 작업 (본 기능):**
    1.  **FastAPI 백엔드 (기능 확장):**
        *   (프로토타입 단계에서 만든) Gemini API 호출 서비스 로직을 실제 사용할 API 엔드포인트에 통합 또는 재사용.
            *   입력: 설명할 용어(들), (선택적) 사용자 ID (인증된 경우), 메모 ID (맥락을 가져오기 위함) 등.
            *   처리:
                *   필요시 PostgreSQL에서 관련 메모 내용이나 사용자 정보를 조회하여 프롬프트 구성에 활용.
                *   Gemini API SDK 또는 HTTP 요청으로 용어 설명 생성. `backend/prompts.py` 활용.
            *   출력: 생성된 용어 설명 및 관련 정보를 PostgreSQL에 저장.
            *   **관련 Python 패키지(backend):** `google-generativeai`, `sqlalchemy`
    2.  **프론트엔드 (React):**
        *   메모 작성/상세 페이지에서 "AI로 용어 설명 요청" 기능 UI 구현.
        *   FastAPI 백엔드의 해당 API 호출 및 결과 표시, 사용자 편집 UI 제공.
            *   **관련 npm 패키지(frontend):** `axios`
    3.  **데이터 저장 (PostgreSQL):**
        *   AI로 설명된 용어와 사용자 편집 내용을 PostgreSQL의 `explained_terms` 테이블에 저장 (사용자별 또는 메모별로 구조화).
*   **AI 활용 포인트 (본 기능):** FastAPI에서 PostgreSQL 연동하여 데이터 조회/저장하는 로직, React에서 API 호출 및 결과 처리/편집 UI 컴포넌트, PostgreSQL 데이터 모델링 생성 요청.

#### 단계 2.2: 설명된 용어 및 메모 임베딩 생성 및 저장 (FR-007 확장) - FastAPI & pgvector
*   **세부 작업:**
    1.  **FastAPI 백엔드:**
        *   텍스트 임베딩 생성을 위한 서비스 로직.
            *   입력: 텍스트 데이터 (메모 내용 또는 용어 설명).
            *   처리: `sentence-transformers` 등 라이브러리를 사용하여 임베딩 벡터 생성.
            *   출력: 생성된 임베딩 벡터.
            *   **관련 Python 패키지(backend):** `sentence-transformers`
        *   메모 또는 설명된 용어 저장/업데이트 시, 위 로직을 호출하여 임베딩을 생성하고 PostgreSQL `memos` 또는 `explained_terms` 테이블의 `embedding` (vector 타입) 컬럼에 저장.
    2.  **데이터베이스 (PostgreSQL with pgvector):**
        *   `memos`, `explained_terms` 테이블에 `embedding` 컬럼 (vector 타입) 추가 및 인덱스 설정.
*   **AI 활용 포인트:** FastAPI에서 임베딩 생성 서비스 로직, PostgreSQL pgvector 컬럼 추가 및 인덱스 설정 SQL/마이그레이션 코드 생성 요청.

#### 단계 2.3: 의미 기반 링크 추천 목록 생성 (FR-009-1) - FastAPI & pgvector
*   **세부 작업:**
    1.  **FastAPI 백엔드:**
        *   "링크 추천" API 엔드포인트 작성.
            *   입력: 현재 보고 있는 메모/용어의 ID 또는 임베딩 벡터.
            *   처리:
                1.  ID로 입력된 경우, 해당 문서의 임베딩 벡터를 PostgreSQL에서 조회.
                2.  pgvector 유사도 검색 쿼리를 사용하여 입력된 임베딩 벡터와 유사한 다른 메모/용어들의 목록 (상위 N개) 검색.
            *   출력: 추천 메모/용어 목록 (ID, 제목, 간략 내용 등).
            *   **관련 Python 패키지(backend):** `sqlalchemy`, `pgvector` 관련 쿼리 기능
    2.  **프론트엔드 (React):**
        *   메모 상세 페이지 등에서 FastAPI 백엔드 API 호출하여 추천 목록 표시.
*   **AI 활용 포인트:** FastAPI에서 pgvector 유사도 검색 로직, 관련 API 엔드포인트, React 추천 목록 UI 및 연동 로직 생성 요청.

#### 단계 2.4: (선택적) 수동 링크 생성 기능 (UI/UX 및 PostgreSQL)
*   **세부 작업:**
    1.  **프론트엔드 (React):** 자동완성 드롭다운 (FastAPI 백엔드 API 통해 데이터 조회).
    2.  **데이터베이스 (PostgreSQL):** `links` 테이블 또는 `memos` 테이블 내 JSON/배열 필드 활용.
*   **AI 활용 포인트:** React 자동완성 컴포넌트 (FastAPI 연동), PostgreSQL 데이터 모델링 (링크 관계 저장) 생성 요청.

---

### 페이즈 3: 검색, 공유 및 고도화 (FastAPI & PostgreSQL 중심)

#### 단계 3.1: 용어 검색 기능 (FR-008) - FastAPI, PostgreSQL/pgvector
*   **세부 작업:**
    1.  **프론트엔드 (React):** 검색 UI.
    2.  **FastAPI 백엔드:**
        *   검색 요청 처리 API 엔드포인트:
            *   **텍스트 기반 검색:** PostgreSQL의 FTS(Full-Text Search) 또는 `LIKE` 쿼리 사용.
            *   **의미 기반 검색:** 사용자 검색어 임베딩 생성 후 pgvector 유사도 검색.
        *   검색 범위(내 용어/공유 용어) 및 정렬 옵션 처리.
*   **AI 활용 포인트:** FastAPI 검색 API 로직 (텍스트, pgvector), React 검색 UI 생성 요청.

#### 단계 3.2: 공유 기능 (FR-009) - FastAPI, PostgreSQL
*   **세부 작업:**
    1.  **데이터 모델링 (PostgreSQL):** `memos` 또는 `explained_terms` 테이블에 `is_shared` (boolean) 필드, 공유 관련 메타데이터.
    2.  **FastAPI 백엔드:** 공유 설정 API, 공유된 콘텐츠 조회 API (권한 검사 포함).
    3.  **프론트엔드 (React):** 공유 설정 UI, 공유 콘텐츠 조회 UI.
*   **AI 활용 포인트:** FastAPI 공유 관련 API 로직, PostgreSQL 스키마, React UI 생성 요청.

#### 단계 3.3: 파일 저장 기능 (Firebase Storage 연동)
*   **세부 작업:**
    1.  **Firebase Storage 설정:** 이미지/파일 업로드를 위한 Storage 규칙 설정.
    2.  **프론트엔드 (React):** Firebase Storage SDK를 사용한 파일 업로드 UI.
        *   **관련 npm 패키지(frontend):** `firebase` (Storage 모듈)
    3.  **FastAPI 백엔드:** 업로드된 파일 URL을 PostgreSQL에 저장하는 로직.
*   **AI 활용 포인트:** Firebase Storage 연동 React 컴포넌트, FastAPI에서 파일 URL 저장 로직 생성 요청.

#### 단계 3.4: 추가 기능 및 고도화
*   **Rich Text Editor 도입:** (프론트엔드 중심, 결과는 FastAPI 통해 PostgreSQL에 저장)
*   **태그(키워드) 및 카테고리 기능 상세 구현 (FR-004, FR-005):** (FastAPI & PostgreSQL)
*   **중요도 표시 기능 (FR-007-1):** (FastAPI & PostgreSQL)
*   **PWA 기능 고도화 (FR-010):** (프론트엔드 중심, Firebase Hosting 배포)
    *   푸시 알림: FastAPI 백엔드에서 FCM 발송 요청 또는 Cloud Function 활용.
        *   **관련 Python 패키지(backend):** `firebase-admin` (FCM) 또는 **관련 npm 패키지(functions):** `firebase-admin` (FCM)
*   **성능 최적화:** PostgreSQL 쿼리 최적화, FastAPI 로직 최적화, 프론트엔드 최적화.
*   **사용자 활동 통계 기능 구현 (FR-012):** (FastAPI & PostgreSQL 중심)
*   **유료화 모델 구현 (PAGE_LIST.md 참고):** (FastAPI 백엔드 중심, 필요시 외부 결제 서비스 연동)
*   **(선택적 확장) 앱 스토어 배포 준비 (FR-011):** (PWA 기반, Firebase Hosting 배포)

---

**일반적인 AI 협업 가이드라인:**
*   각 세부 작업 단계별로 AI에게 명확하고 구체적인 목표를 제시합니다.
*   "이 파일(`DEVELOPMENT_PLAN.md`)의 X.Y 단계를 진행 중이야. 이 단계의 목표는 Z인데, `FUNCTIONAL_REQUIREMENTS.md`의 FR-XXX와 `PROJECT_OVERVIEW.md`의 관련 내용을 참고해서 **FastAPI 백엔드에** 데이터를 저장하고 조회하는 Python 코드를 만들어줘." 와 같이 컨텍스트를 명확히 전달합니다.
*   **본 `DEVELOPMENT_PLAN.md`를 포함한 프로젝트 관련 문서들(`PROJECT_OVERVIEW.md`, `FUNCTIONAL_REQUIREMENTS.md`, `README.md`)은 프로젝트의 목표, 기능, 기술 스택, 진행 계획에 대한 최신 합의 사항을 담고 있으며, AI와 개발자 간의 일관된 이해를 돕는 핵심 지침서로 활용합니다. 변경사항 발생 시 해당 문서들을 우선적으로 업데이트하여 항상 최신 상태를 유지합니다.**
*   AI가 생성한 코드는 반드시 직접 검토하고, 이해하려고 노력하며, 필요시 수정합니다.
*   오류 발생 시, 오류 메시지와 함께 AI에게 도움을 요청합니다.
*   작은 단위로 자주 테스트하고 통합합니다 (Docker Compose, Firebase 에뮬레이터 적극 활용).

이 계획서는 살아있는 문서이므로, 프로젝트 진행 상황에 따라 언제든지 수정하고 업데이트할 수 있습니다. 