# 1. Node.js 공식 이미지를 기반으로 합니다.
# LTS (Long Term Support) 버전을 사용하는 것이 안정적입니다.
FROM node:20-alpine AS development

# 2. 작업 디렉토리를 설정합니다.
# 컨테이너 내부에서 명령이 실행될 기본 경로입니다.
WORKDIR /app

# 3. package.json과 package-lock.json (또는 yarn.lock 등)을 먼저 복사합니다.
# 의존성 파일들이 변경되지 않으면 이 레이어는 캐시되어 빌드 시간을 단축합니다.
COPY package*.json ./

# 4. 의존성 패키지들을 설치합니다.
# npm ci는 package-lock.json을 사용하여 더 빠르고 일관된 설치를 제공합니다.
# 일반적인 개발 환경에서는 npm install도 무방합니다.
RUN npm install

# 5. 프로젝트의 나머지 소스 코드를 작업 디렉토리로 복사합니다.
COPY . .

# 6. Vite 개발 서버가 사용하는 기본 포트를 노출합니다.
EXPOSE 5173

# 7. 컨테이너가 시작될 때 실행될 기본 명령입니다.
# Vite 개발 서버를 실행합니다. '--host' 옵션은 Docker 외부에서 접근 가능하도록 합니다.
CMD ["npm", "run", "dev", "--", "--host"] 