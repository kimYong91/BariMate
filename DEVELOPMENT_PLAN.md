# BariMate 애플리케이션 개발 계획서

**목표:** AI 기반 용어 설명 및 상호 연결 기능을 갖춘 메모 애플리케이션 개발

**주요 기술 스택 (barimate 규칙 기반):**
*   **백엔드:** Python, FastAPI
*   **프론트엔드:** React
*   **데이터베이스:** PostgreSQL (pgvector 확장 사용 권장)
*   **AI 모델:** Google Gemini API (프롬프트는 `backend/prompts.py`에서 관리)
*   **환경:** Docker, Docker Compose

**참고 문서:**
*   `PAGE_LIST.md`: 화면 목록 및 구성
*   `FUNCTIONAL_REQUIREMENTS.md`: 기능 요구사항 명세
*   `barimate` (프로젝트 규칙): 핵심 개발 가이드라인

---

## 단계별 개발 계획

### 페이즈 1: 기본 메모 애플리케이션 골격 구축

#### 단계 1.1: 프로젝트 초기 설정 및 기본 환경 구성
*   **세부 작업:**
    1.  `barimate` 규칙에 따라 `backend/` (FastAPI), `frontend/` (React) 디렉토리 구조 생성.
    2.  루트 디렉토리에 `docker-compose.yml` 파일 작성 (FastAPI 백엔드, React 프론트엔드, PostgreSQL 서비스 정의).
    3.  `backend/Dockerfile` 및 `frontend/Dockerfile` 기본 설정 (FastAPI 실행, React 빌드 및 Nginx 서빙).
    4.  PostgreSQL Docker 컨테이너에 `pgvector` 확장이 설치되도록 설정하거나, 해당 확장이 포함된 이미지를 사용.
    5.  기본적인 "Hello World" 수준의 FastAPI 엔드포인트 및 React 컴포넌트 작성, FastAPI가 PostgreSQL에 연결되는지 기본 확인.
*   **AI 활용 포인트:** Dockerfile, docker-compose.yml (PostgreSQL 서비스 포함), pgvector 설치/설정, 각 프레임워크별 기본 "Hello World" 코드, FastAPI-PostgreSQL 기본 연결 코드 생성 요청.
*   **DB 선택:** PostgreSQL (`pgvector` 확장 포함) 사용. 백엔드 `models.py`에 SQLAlchemy 등을 이용한 기본 테이블 모델 정의 (예: `User`, `Memo`).

#### 단계 1.2: 사용자 인증 기능 구현 (FR-001, FR-002, FR-003)
*   **세부 작업:**
    1.  **백엔드 (FastAPI):**
        *   `User` 모델 정의 (아이디(이메일), 해시된 비밀번호, 닉네임 등).
        *   회원가입 API 엔드포인트 구현 (`/auth/signup`): 유효성 검사, 비밀번호 해싱 (`passlib` 사용), DB 저장.
        *   로그인 API 엔드포인트 구현 (`/auth/login`): 사용자 인증, JWT Access Token 및 Refresh Token 발급.
        *   Access Token 갱신 API 엔드포인트 구현 (`/auth/refresh`): Refresh Token을 사용하여 새 Access Token 발급.
        *   로그아웃 로직 (필요시 서버 측 Refresh Token 무효화).
        *   API 엔드포인트 보호 (FastAPI `Depends`, `OAuth2PasswordBearer` 사용).
    2.  **프론트엔드 (React):**
        *   회원가입, 로그인 페이지 UI 컴포넌트 생성.
        *   API 호출 로직 작성 (axios 등 사용).
        *   로그인 성공 시 토큰 저장 (HttpOnly 쿠키 또는 `localStorage` - XSS 방어책 포함).
        *   로그아웃 시 토큰 제거.
        *   API 요청 시 `Authorization` 헤더에 Access Token 포함.
        *   Access Token 만료 시 자동 갱신 로직 구현.
*   **AI 활용 포인트:** FastAPI 라우터, Pydantic 모델, 인증 로직 코드 스켈레톤 생성 요청. React 컴포넌트, API 호출 함수 생성 요청.
*   **라이브러리:**
    *   백엔드: `python-jose[cryptography]` (JWT), `passlib[bcrypt]` (비밀번호 해싱), `SQLAlchemy` (ORM), `psycopg2-binary` (PostgreSQL 드라이버).
    *   프론트엔드: `axios` (HTTP 클라이언트), `jwt-decode` (토큰 디코딩).

#### 단계 1.3: 기본 텍스트 메모 CRUD 기능 구현 (FR-004, FR-007 일부)
*   **세부 작업:**
    1.  **백엔드 (FastAPI):**
        *   `Memo` 모델 정의 (id, user_id, title, content, created_at, updated_at 등).
        *   메모 생성 API 엔드포인트 (`/memos/` POST).
        *   사용자별 메모 목록 조회 API 엔드포인트 (`/memos/` GET).
        *   특정 메모 상세 조회 API 엔드포인트 (`/memos/{memo_id}` GET).
        *   메모 수정 API 엔드포인트 (`/memos/{memo_id}` PUT).
        *   메모 삭제 API 엔드포인트 (`/memos/{memo_id}` DELETE).
        *   모든 메모 관련 엔드포인트는 사용자 인증 필요.
    2.  **프론트엔드 (React):**
        *   메모 작성 페이지 UI (제목, 내용 입력 필드 - 초기에는 일반 `textarea`, 추후 Rich Text Editor 고려).
        *   메모 목록 표시 페이지 UI.
        *   메모 상세 조회/편집 페이지 UI.
        *   각 CRUD 작업에 대한 API 연동.
*   **AI 활용 포인트:** FastAPI CRUD 라우터 및 서비스 로직 생성 요청. React 컴포넌트 및 API 연동 코드 생성 요청.
*   **DB:** `Memo` 테이블 스키마 설계.

---

### 페이즈 2: AI 기반 용어 정리 및 링크 추천 기능 구현

#### 단계 2.1: AI 기반 용어 설명 생성 (FR-006)
*   **세부 작업:**
    1.  **백엔드 (FastAPI):**
        *   `backend/prompts.py`에 용어 설명을 위한 Gemini API 프롬프트 템플릿 정의.
        *   "용어 설명 요청" API 엔드포인트 구현 (`/ai/explain-term`):
            *   입력: 설명할 용어(들), (선택적) 메모 본문 맥락.
            *   처리: Gemini API 호출하여 용어 설명 생성.
            *   출력: 생성된 용어 설명.
    2.  **프론트엔드 (React):**
        *   메모 작성/상세 페이지 내에 "AI로 용어 설명 요청" 버튼 또는 기능 추가.
        *   사용자가 텍스트를 선택하거나 특정 용어를 입력하면, 해당 내용을 백엔드 API로 전송.
        *   AI가 생성한 설명을 화면에 표시하고, 사용자가 편집할 수 있도록 UI 제공 (FR-006의 편집 기능은 초기에는 간단하게).
*   **AI 활용 포인트:** Gemini API 연동 코드 (Python `google-generativeai` 라이브러리 사용), 프롬프트 구성 로직, API 엔드포인트 생성 요청. React에서 AI 설명 결과 표시 및 편집 UI 구성 요청.

#### 단계 2.2: 설명된 용어 및 메모 임베딩 생성 및 저장 (FR-007 확장)
*   **세부 작업:**
    1.  **백엔드 (FastAPI):**
        *   `Term` (또는 `ExplainedTerm`) 모델 정의: (id, user_id, memo_id (원본 메모 연결), term_text, explanation_text, embedding (벡터), created_at 등).
        *   메모 저장 시 또는 AI 설명 저장 시 (FR-007), 해당 **메모의 내용**과 **생성된 설명 텍스트**에 대한 임베딩 벡터를 각각 생성.
            *   라이브러리: `sentence-transformers`.
        *   생성된 임베딩 벡터를 `Memo` 테이블과 `Term` 테이블의 `embedding` 컬럼에 저장.
            *   이 작업은 비동기적으로 처리하여 사용자 응답 시간에 영향을 주지 않도록 고려 (예: FastAPI `BackgroundTasks`).
        *   **DB 고려사항:** `embedding` 컬럼은 PostgreSQL의 `Vector` 타입 (`pgvector` 확장을 통해 제공)을 사용. JSON/BLOB 형태의 임시 저장 방식은 고려하지 않음.
*   **AI 활용 포인트:** `sentence-transformers` 사용법, 임베딩 생성 함수 작성, FastAPI `BackgroundTasks` 사용법, 임베딩 DB 저장 로직 (PostgreSQL `Vector` 타입 사용) 코드 생성 요청.
*   **라이브러리:** `sentence-transformers`, `sqlalchemy-pgvector` (SQLAlchemy에서 pgvector 사용을 위한 라이브러리).

#### 단계 2.3: 수동 링크 생성 UI/UX 프로토타입 (프론트엔드)
*   **세부 작업:**
    1.  **프론트엔드 (React):**
        *   메모 편집 화면에서, 사용자가 `[[`를 입력하면 현재까지 저장된 `Term` 목록(또는 `Memo` 제목 목록)을 자동완성 형태로 보여주는 드롭다운 UI 구현.
        *   사용자가 자동완성 목록에서 항목을 선택하면, 해당 항목의 ID 또는 고유 식별자를 가진 `[[term_id_or_title]]` 형태로 텍스트가 삽입되도록 함.
        *   메모를 보여줄 때는, `[[term_id_or_title]]` 형식을 파싱하여 해당 `Term` 또는 `Memo` 상세 페이지로 이동하는 실제 HTML 링크로 변환하여 렌더링.
*   **AI 활용 포인트:** React 자동완성 드롭다운 컴포넌트 구현, 정규표현식을 사용한 텍스트 파싱 및 링크 변환 로직 생성 요청.

#### 단계 2.4: 링크 추천 목록 생성 로직 (백엔드)
*   **세부 작업:**
    1.  **백엔드 (FastAPI):**
        *   "링크 추천" API 엔드포인트 구현 (`/memos/{memo_id}/recommend-links` 또는 `/terms/{term_id}/recommend-links`):
            *   입력: 현재 보고 있는 메모 ID 또는 용어 ID.
            *   처리:
                1.  입력된 ID에 해당하는 메모/용어의 임베딩 벡터를 DB에서 조회.
                2.  DB에 저장된 **다른 모든** 메모/용어들의 임베딩 벡터들과 코사인 유사도 계산.
                3.  유사도가 높은 상위 N개의 메모/용어 ID (또는 제목/내용) 목록 반환.
            *   **최적화:** 메모/용어 개수가 많아지면 모든 벡터와 비교하는 것은 비효율적이므로, FAISS, Annoy 같은 라이브러리 또는 pgvector 같은 벡터 DB의 유사도 검색 기능 활용 고려. 초기에는 단순 전체 비교로 시작.
*   **AI 활용 포인트:** NumPy/SciPy를 이용한 코사인 유사도 계산 함수 작성, 상위 N개 찾는 로직, (추후) FAISS/Annoy 사용법 및 통합 코드 생성 요청.

#### 단계 2.5: 추천 링크 목록 UI 표시 및 연결 (프론트엔드 + 백엔드)
*   **세부 작업:**
    1.  **프론트엔드 (React):**
        *   메모 상세 페이지 또는 용어 설명 페이지의 특정 영역(예: "관련 있는 메모" 섹션)에 2.4 단계에서 받은 추천 목록을 표시.
        *   각 추천 항목은 클릭 가능하도록 하고, 클릭 시 해당 메모/용어 상세 페이지로 이동.
        *   (선택적 고급 기능) 추천 항목 옆에 "이 메모와 연결하기" 버튼을 두어, 클릭 시 현재 메모와 해당 추천 메모를 '명시적으로' 연결.
    2.  **백엔드 (FastAPI):**
        *   (선택적 고급 기능 구현 시) "명시적 링크 생성" API 엔드포인트 구현 (`/links/` POST):
            *   입력: 소스 메모/용어 ID, 타겟 메모/용어 ID.
            *   처리: 이 두 ID 간의 관계를 저장할 별도의 `Links` 테이블 (예: `source_id`, `target_id`, `link_type`)에 레코드 생성.
*   **AI 활용 포인트:** React에서 추천 목록 표시 UI, 명시적 링크 생성을 위한 API 호출 및 백엔드 로직 코드 생성 요청.

---

### 페이즈 3: 검색, 공유 및 고도화

#### 단계 3.1: 용어 검색 기능 (FR-008)
*   **세부 작업:**
    1.  **백엔드 (FastAPI):**
        *   검색 API 엔드포인트 구현 (`/search/terms`):
            *   입력: 검색 키워드, 검색 범위 (내 용어 - 기본).
            *   처리: DB에서 `Term` 테이블의 `term_text` 또는 `explanation_text` 필드에서 키워드 검색 (초기에는 단순 `LIKE` 검색, 추후 Full-Text Search 또는 임베딩 기반 의미 검색 고려).
    2.  **프론트엔드 (React):**
        *   검색창 UI 구현.
        *   검색 결과 표시 UI 구현.
*   **AI 활용 포인트:** 검색 API 로직, (추후) Elasticsearch 또는 Typesense와 같은 검색 엔진 연동, 또는 임베딩 기반 검색 로직 구현 요청.

#### 단계 3.2: 공유 기능 (FR-009) - (기본 설계 후 추후 구체화)
*   `Term` 모델에 `is_shared` (boolean) 같은 플래그 추가.
*   공유된 용어 목록 조회 API, 공유된 용어 상세 조회 API 등 설계.

#### 단계 3.3: 추가 기능 및 고도화
*   Rich Text Editor 도입 (예: React Quill, Draft.js).
*   태그(키워드) 기능 상세 구현 (`PAGE_LIST.md` 참고).
*   카테고리 기능 구현 (`PAGE_LIST.md` 참고).
*   성능 최적화 (DB 쿼리, 임베딩 검색 속도 등).
*   PWA 지원 (FR-010).

---

**일반적인 AI 협업 가이드라인:**
*   각 세부 작업 단계별로 AI에게 명확하고 구체적인 목표를 제시합니다.
*   "이 파일(`DEVELOPMENT_PLAN.md`)의 X.Y 단계를 진행 중이야. 이 단계의 목표는 Z인데, `barimate` 규칙과 `FUNCTIONAL_REQUIREMENTS.md`의 FR-XXX를 참고해서 FastAPI로 A 기능을 하는 API 엔드포인트 코드를 만들어줘." 와 같이 컨텍스트를 명확히 전달합니다.
*   AI가 생성한 코드는 반드시 직접 검토하고, 이해하려고 노력하며, 필요시 수정합니다.
*   오류 발생 시, 오류 메시지와 함께 AI에게 도움을 요청합니다.
*   작은 단위로 자주 테스트하고 통합합니다.

이 계획서는 살아있는 문서이므로, 프로젝트 진행 상황에 따라 언제든지 수정하고 업데이트할 수 있습니다. 