# BariMate (가칭) - 신입 직원을 위한 AI 기반 용어 정리 및 공유 플랫폼

## 1. 문제 정의

신입 직원들은 업무 회의나 실무 중에 수많은 기술 용어나 새로운 개념들을 접하게 됩니다. 이를 즉시 이해하거나 체계적으로 정리하기는 어렵습니다. 기존 방식으로는:

*   모르는 용어를 메모장에 수동으로 기록
*   ChatGPT나 구글 검색을 통해 개별적으로 검색
*   검색한 내용을 별도로 정리하거나 저장하지 않으면 추후 재검색의 어려움

이러한 과정은 번거롭고 반복적이며, 습득한 지식을 효과적으로 관리하기 어렵게 만듭니다.

## 2. 제안 해결책

사용자가 직접 메모하거나 회의 중 녹음한 내용을 바탕으로 주요 용어를 자동으로 추출하고, AI가 주제 기반으로 정리해주는 **PWA(Progressive Web App) 서비스**를 개발합니다. 이 서비스는 웹의 접근성과 앱의 사용성을 결합하여, 설치 없이도 홈 화면 추가, 오프라인 일부 기능 사용 등이 가능하며, 필요시 **주요 앱 스토어 등록**도 고려하여 사용자 접근성을 극대화합니다.

*   **입력 방식**: 텍스트 메모 (초기 집중), 음성 녹음 (향후 확장 고려)
*   **정리 방식**: 사용자가 "백엔드", "자바"와 같은 주제를 입력하고 관련 용어를 메모 후, "설명" 버튼을 누르면 AI가 해당 주제와 관련된 용어들을 표 형태로 정리 (Gemini API 활용)
*   **데이터 관리**: 정리된 내용은 **NoSQL 데이터베이스인 Firestore**에 저장되어 언제든지 다시 열람 가능하며, 실시간 동기화 및 오프라인 접근을 지원합니다.
*   **검색 기능**: 과거에 입력하거나 설명 받은 용어를 손쉽게 검색 (Firestore 기본 쿼리 및 **Vector Search** 활용한 의미 기반 검색 지원).
*   **공유 기능**: 다른 사용자들이 정리한 용어 설명도 열람하고 검색하여 정보 공유 (Firestore 및 보안 규칙 활용).

모든 직군의 사용자를 대상으로 하며, 초기에는 핵심 기능에 집중하고 사용자 피드백을 통해 점진적으로 기능을 확장해 나갈 예정입니다. (예: **사용자 활동 기반 기본 통계 기능** 등)

## 3. 핵심 기능

*   **메모 입력**: 텍스트 기반 용어 및 내용 입력 (Firestore 저장)
*   **(향후) 음성 녹음 및 단어 추출**: 회의/대화 내용 녹음 후 STT(Speech-to-Text) 기술을 활용한 주요 단어 자동 추출
*   **AI 설명**: 입력된 용어들에 대해 AI(Gemini API)가 주제 기반으로 상세 설명 및 표 형태로 정리 (FastAPI 백엔드에서 처리, Firestore 저장)
*   **용어 검색**: 앱 내에 저장된 자신의 용어 및 설명 검색 (Firestore 쿼리, **Firestore Vector Search** 활용)
*   **AI 기반 용어 연결**: 저장된 용어/메모 간의 관련성을 AI가 추천하고, 사용자가 수동으로 연결하여 지식 네트워크 구축 (FastAPI 백엔드, Firestore Vector Search)
*   **공유된 정리글 열람 및 검색**: 다른 사용자가 공유한 용어 정리 내용 열람 및 검색 (Firestore, 보안 규칙)
*   **사용자 인증**: 로그인 및 회원가입 기능 (Firebase Authentication)
*   **PWA 기능**: 웹 앱의 홈 화면 추가, 오프라인 지원 (일부 콘텐츠), 푸시 알림 (AI 결과 등)

## 4. 목표 사용자

*   회사에 처음 입사한 신입 직원
*   새로운 분야의 업무를 시작하는 비전공자
*   다양한 기술 용어 및 개념 학습이 필요한 모든 직장인

## 5. 기대 효과

*   신입 직원의 빠른 업무 적응 지원
*   용어 학습 및 정리 시간 단축
*   체계적인 지식 관리 및 활용 능력 향상
*   사용자 간 정보 공유를 통한 집단 지성 활용
*   **PWA를 통한 웹/앱 경험 통합 및 접근성 향상**
*   **(선택적) 앱 스토어 배포를 통한 추가 사용자 확보 및 신뢰도 제고**

## 6. 기술 스택 (하이브리드 아키텍처: FastAPI + Firebase)

*   **Frontend**:
    *   React (TypeScript)
    *   Vite (개발 서버 및 빌드 도구)
    *   PWA (서비스 워커, 웹 매니페스트)
    *   Docker (Nginx를 통한 정적 파일 서빙용 프로덕션 빌드)
*   **Backend**:
    *   Python
    *   FastAPI (웹 프레임워크)
    *   Docker (애플리케이션 컨테이너화)
*   **Database**:
    *   **Firestore (Google Firebase)**: NoSQL 문서 데이터베이스 (데이터 저장, 실시간 동기화, 오프라인 지원, Vector Search 기능 활용)
*   **AI/ML**:
    *   Google Gemini API (용어 설명 생성, 임베딩 생성 등)
*   **Firebase Services (보조 역할)**:
    *   **Firebase Authentication**: 사용자 인증 (클라이언트에서 직접 사용, 백엔드에서 토큰 검증)
    *   **Firebase Hosting**: PWA 프론트엔드 배포 (CDN, SSL, 커스텀 도메인) - 프로덕션 환경
    *   **Cloud Storage for Firebase**: 사용자 파일 저장 (이미지 등)
    *   **Cloud Functions for Firebase (제한적 사용)**: Firebase 서비스 간 간단한 트리거, FCM 푸시 알림 등 (핵심 로직은 FastAPI 백엔드에서 처리)
*   **Development & Deployment**:
    *   **Docker & Docker Compose**: 로컬 개발 환경 구성, 서비스 컨테이너화 및 오케스트레이션
    *   **Firebase CLI**: Firebase 서비스 배포 및 관리 (Hosting, Functions 등)
    *   **Firebase Emulator Suite (선택적 로컬 테스트)**: Firestore, Authentication 등 Firebase 서비스 로컬 모방
    *   Node.js, npm

## 로컬 개발 환경 실행 (Docker Compose)

이 프로젝트는 Docker Compose를 사용하여 프론트엔드(React/Vite), 백엔드(FastAPI) 서비스를 컨테이너화하여 실행합니다. 이를 통해 개발 환경을 일관되게 관리하고 간편하게 시작할 수 있습니다.

**사전 요구 사항:**

*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치

**실행 방법:**

1.  **프로젝트 복제 및 디렉토리 이동**:
    ```bash
    git clone <프로젝트_저장소_URL> # 실제 프로젝트 저장소 URL로 대체해주세요.
    cd BariMate
    ```

2.  **Docker Compose 실행**:
    프로젝트 루트 디렉토리 (`docker-compose.yml` 파일이 있는 곳)에서 다음 명령을 실행하여 모든 서비스를 빌드하고 시작합니다.
    ```bash
    docker-compose up --build
    ```
    *   `--build` 옵션은 최초 실행 시 또는 Dockerfile 내용이 변경되었을 때 이미지를 새로 빌드합니다.
    *   이미지가 이미 빌드되어 있고 변경 사항이 없다면 `docker-compose up` 만으로도 실행 가능합니다.

3.  **서비스 접속**:
    서비스가 정상적으로 실행되면, 웹 브라우저에서 다음 주소로 접속하여 확인할 수 있습니다:
    *   **프론트엔드 (Vite 개발 서버)**: `http://localhost:5173`
    *   **백엔드 API (FastAPI)**:
        *   API 직접 호출 예시: `http://localhost:8000/api/v1/some_endpoint` (실제 엔드포인트로 변경 필요)
        *   Swagger UI (API 문서 및 테스트): `http://localhost:8000/docs`

4.  **코드 수정 및 변경 사항 확인**:
    로컬 머신의 소스 코드를 수정하면 Docker 컨테이너 내에서 실행 중인 서버에 변경 사항이 자동으로 반영됩니다.
    *   **프론트엔드**: `frontend` 폴더 내의 코드를 수정하면, Vite 개발 서버가 변경을 감지하여 웹 브라우저가 거의 즉시 새로고침(HMR - Hot Module Replacement)됩니다.
    *   **백엔드**: `backend` 폴더 내의 코드를 수정하면, FastAPI (Uvicorn) 서버가 자동으로 재시작되어 변경 사항이 반영됩니다.

5.  **컨테이너 로그 확인**:
    각 서비스의 실시간 로그를 확인하고 싶다면, 별도의 터미널에서 다음 명령을 사용합니다.
    ```bash
    docker-compose logs -f frontend
    docker-compose logs -f backend
    ```

6.  **개발 환경 중지**:
    *   `docker-compose up` 명령을 실행한 터미널에서 `Ctrl+C`를 누르면 서비스가 중지됩니다.
    *   모든 컨테이너를 완전히 중지하고 관련 네트워크 등을 제거하려면 다음 명령을 사용합니다:
        ```bash
        docker-compose down
        ```

**(선택적) Firebase Emulator Suite 사용**:
Firestore 데이터 확인, Authentication 사용자 관리 등 Firebase 관련 기능을 로컬에서 테스트하고 싶다면, 별도로 Firebase Emulator Suite를 실행할 수 있습니다.
1.  Firebase CLI 설치 및 로그인, 프로젝트 연결이 필요합니다. (자세한 내용은 공식 Firebase 문서 참고)
2.  프로젝트 루트에서 `firebase emulators:start` 명령으로 실행합니다.
3.  에뮬레이터 UI는 보통 `http://localhost:4000` 에서 접근 가능합니다.
    *   **주의**: Docker Compose로 실행되는 FastAPI 백엔드는 기본적으로 Firebase Emulator Suite와 직접 통신하지 않습니다. 에뮬레이터와 연동하려면 FastAPI 백엔드의 Firebase 초기화 코드에서 에뮬레이터 호스트 및 포트를 사용하도록 별도의 설정이 필요합니다. (예: `FIRESTORE_EMULATOR_HOST="localhost:8080"` 환경 변수 설정 등)

## 7. 사용자 인터페이스 (UI/UX)

*   신입이나 비전공자도 쉽게 접근할 수 있는 사용자 친화적인 인터페이스
*   직관적이고 간결한 정보 구조
*   모바일 우선 디자인 (Mobile-First Design)

## 8. 추후 발전 방향

*   **PWA 기능 고도화**: 더 많은 오프라인 기능 지원, 백그라운드 동기화, 성능 최적화.
*   **앱 스토어 등록 추진**: Google Play Store 등 주요 앱 스토어에 PWA 패키징 및 배포.
*   **사용자 활동 통계 기능 도입 및 확장**: 서비스 개선 및 사용자 참여 유도를 위한 다양한 통계 및 랭킹 기능 개발.
*   **팀/그룹별 용어 사전 공유 기능**
*   **사용자 활동 기반 추천 시스템** (관련 용어, 학습 자료 등)
*   **다국어 지원**
*   **(장기적) 음성 입력 및 STT 기반 용어 추출 기능 완성도 향상**
