# frontend/Dockerfile
# 이 Dockerfile은 frontend 폴더 내에서 빌드하는 것을 가정합니다.

# 1. 빌드 환경 (Node.js 설치 및 Vite 앱 빌드)
FROM node:18-alpine AS builder

WORKDIR /app

# package.json과 package-lock.json (또는 npm-shrinkwrap.json 등)을 먼저 복사
# npm ci는 package-lock.json을 사용해 더 빠르고 안정적인 설치를 제공
COPY package.json package-lock.json* ./

# 의존성 설치 (npm ci 사용 권장)
RUN npm ci

# 나머지 소스 코드 복사
COPY . .

# Vite 앱 빌드 (환경 변수 등 필요시 여기에 추가)
# 예: RUN VITE_API_URL=/api npm run build
RUN npm run build

# 2. 서빙 환경 (Nginx 사용)
FROM nginx:stable-alpine

# Vite 빌드 결과물(dist 폴더)을 Nginx의 기본 HTML 폴더로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# (선택 사항) Nginx 설정을 커스터마이징하려면 아래 주석 해제 후 nginx.conf 파일 생성 및 복사
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf # 사용자 정의 nginx.conf 사용

# Nginx가 80번 포트 사용
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"] 