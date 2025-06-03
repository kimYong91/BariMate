# 프로젝트 개요서

## 1. 프로젝트 명칭

-   기술 용어 정리 웹앱 (가칭)

## 2. 프로젝트 목표

-   신입 직원이나 비전공자가 업무 중 접하는 기술 용어나 개념을 쉽고 빠르게 이해하고, 체계적으로 정리하여 학습 효율을 높일 수 있는 **PWA(Progressive Web App) 형태의** 웹 애플리케이션 개발 **(FastAPI 백엔드와 Firebase 서비스의 하이브리드 아키텍처 기반)**.

## 3. 주요 기능

-   텍스트 기반 메모 입력 기능 (제목, 내용, 태그, 카테고리, 중요도 표시 등) - **주요 데이터는 PostgreSQL**에 저장, **FastAPI 백엔드**를 통해 처리.
-   사용자가 입력한 텍스트 메모와 주제를 바탕으로 AI가 관련 용어를 분석/추출하고 설명을 제공 (표 형태 권장, Gemini API 활용) - **FastAPI 백엔드**에서 **Gemini API** 연동, 결과는 **PostgreSQL**에 저장.
-   AI가 생성한 용어 설명에 대한 사용자 편집 및 개인 자료(이미지 등) 첨부 기능 - 이미지는 **Cloud Storage for Firebase**에, 메타데이터 및 텍스트는 **PostgreSQL**에 저장 (FastAPI 백엔드 경유).
-   정리된 용어 및 설명 내용을 앱 내에 개인별로 저장 및 언제든지 재열람 기능 (임베딩 벡터 포함 저장) - **PostgreSQL**에 저장 (pgvector 활용하여 의미 기반 검색 지원), **FastAPI 백엔드**를 통해 처리.
-   AI 기반 관련 메모/용어 추천 및 사용자 수동 링크 기능 - **FastAPI 백엔드**에서 **PostgreSQL (pgvector)** 활용.
-   자신이 정리한 용어 및 다른 사용자가 공유한 용어 설명을 검색할 수 있는 기능 (의미 기반 검색 고려) - **FastAPI 백엔드**에서 **PostgreSQL** (텍스트 검색, pgvector) 쿼리 활용.
-   다른 사용자들이 정리하고 공유한 용어 설명 열람 기능 (집단 지성 활용) - **FastAPI 백엔드**를 통해 **PostgreSQL** 데이터 조회, 필요시 **Firestore 보안 규칙**과 연계.
-   사용자 인증을 위한 로그인 및 회원가입 기능 - **Firebase Authentication** 활용 (프론트엔드 직접 연동 및 **FastAPI 백엔드**에서 토큰 검증).
-   **PWA 기능**: 웹 앱을 모바일 홈 화면에 추가, 오프라인 일부 기능 지원, 푸시 알림 (AI 결과 알림 등) - **Firebase Hosting** (배포), **서비스 워커** (프론트엔드), **Cloud Functions** (푸시 알림 발송).

## 4. 타겟 사용자

-   회사에 새로 입사하여 업무 관련 기술 용어 학습이 필요한 신입 직원
-   IT 비전공자로서 개발 또는 기술 관련 부서와 협업해야 하는 직원
-   새로운 기술 분야를 학습하고자 하는 모든 사용자

## 5. 기대 효과

-   낯선 기술 용어 및 개념에 대한 학습 장벽 완화
-   정보 검색 및 정리 시간의 획기적인 단축으로 업무 효율성 증대
-   휘발성 강한 메모나 검색 기록 대신, 체계적인 지식 아카이빙 가능
-   사용자 간 용어 정리 내용 공유를 통한 지식 확장 및 학습 커뮤니티 형성 기반 마련
-   **PWA를 통해 웹의 접근성과 네이티브 앱의 사용성을 동시에 제공하여** 언제 어디서든 학습 가능
-   **주요 앱 스토어(Google Play Store 등) 등록을 통한 사용자 접근성 확대 및 홍보 효과**

## 6. 기술 스택 (예상)

-   **Frontend:** React, TypeScript (**PWA 구현**: 서비스 워커, 웹 매니페스트)
-   **Backend (`backend/`):** Python, FastAPI
    -   **Database:** PostgreSQL (with pgvector) - Docker로 관리
-   **Cloud Services (Firebase):**
    -   **Firebase Authentication:** 사용자 인증 (FastAPI 백엔드와 연동)
    -   **Firestore (NoSQL - 보조적):** 사용자 프로필 부가 정보, 실시간 동기화 필요 간단 데이터 등.
    -   **Cloud Storage for Firebase:** 사용자 업로드 파일 저장.
    -   **Firebase Hosting:** PWA 웹 앱 배포.
    -   **Cloud Functions for Firebase (제한적):** Firebase 서비스 간 트리거, FCM 푸시 알림 등.
-   **AI:** Google Gemini API (주로 FastAPI 백엔드를 통해 연동)
-   **Development/Deployment Tools:** Docker, Docker Compose, Firebase CLI, Firebase Emulator Suite.
-   **App Store Deployment (고려):** TWA (Trusted Web Activities), PWABuilder 등.

## 7. 프로젝트 일정 (간략히)

-   **아이디어 구체화 및 기획:** *YYYY-MM-DD ~ YYYY-MM-DD*
-   **설계 (와이어프레임, DB, API):** *YYYY-MM-DD ~ YYYY-MM-DD*
-   **개발:** *YYYY-MM-DD ~ YYYY-MM-DD*
-   **테스트 및 QA:** *YYYY-MM-DD ~ YYYY-MM-DD*
-   **배포:** *YYYY-MM-DD* (초기 PWA 웹 배포, 이후 앱 스토어 배포 준비)
-   **유지보수 문서 작성:** *YYYY-MM-DD ~ YYYY-MM-DD*

## 8. 주요 고려 사항 (프로젝트 진행 지침)

-   **데이터 모델링 (PostgreSQL & Firestore):** 핵심 데이터는 PostgreSQL (관계형, pgvector) 중심으로 설계하며, Firestore는 특정 목적(프로필 부가 정보, 간단한 실시간 데이터 등)에 제한적으로 활용합니다. FastAPI 백엔드에서 데이터 일관성 및 트랜잭션 관리에 유의합니다.
-   **PWA 품질 기준:** 앱 스토어 등록 및 우수한 사용자 경험을 위해 PWA의 성능(Lighthouse 점수 등), 오프라인 지원 범위, 설치 가능성, 보안(HTTPS) 등의 품질 기준을 충족하도록 개발합니다.
-   **점진적 기능 개발:** 초기에는 핵심 기능(메모, AI 용어 설명, 검색 - FastAPI 백엔드 중심)에 집중하여 빠르게 프로토타입을 개발하고 사용자 피드백을 받습니다. 통계, 고급 공유 기능 등은 이후 단계에서 점진적으로 확장합니다.
-   **Firebase 및 자체 백엔드 서비스의 조화로운 활용:** 각 기술의 강점을 최대한 활용하여 개발 효율성과 서비스 안정성을 높입니다. Firebase는 인증, 호스팅, 파일 스토리지 등에, FastAPI 백엔드는 핵심 비즈니스 로직, 복잡한 데이터 처리, AI 연동 등에 집중합니다.
-   **보안:** PostgreSQL 데이터 접근 및 API 엔드포인트 보안(FastAPI), Firebase 서비스 보안 규칙(Firestore, Storage)을 철저히 설정하여 사용자 데이터와 시스템을 안전하게 보호합니다.
-   **비용 최적화:** PostgreSQL 운영 비용, Firebase 서비스 사용량(Firestore, Cloud Functions, Storage 등), AI API 호출 비용 등을 모니터링하고, 비용 효율적인 방식으로 서비스를 설계하고 운영합니다.
-   **AI 협업:** 본 문서들을 포함한 프로젝트 문서는 AI와의 협업 시 상호 이해를 돕는 기준으로 활용하며, 변경 사항 발생 시 최신 상태로 업데이트합니다. (FastAPI 백엔드 역할 명시) 