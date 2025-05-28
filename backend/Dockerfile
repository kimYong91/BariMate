# backend/Dockerfile
# 이 Dockerfile은 backend 폴더 내에서 빌드하는 것을 가정합니다.
# (예: docker build -t barimate-backend backend/)

# ---------- Base Image ----------
FROM python:3.12-slim as base

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# backend 폴더 내의 requirements.txt를 복사합니다.
COPY requirements.txt .

RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# ---------- App Image ----------
FROM base as final

WORKDIR /app
# backend 폴더(현재 빌드 컨텍스트)의 모든 내용을 /app/ 에 복사합니다.
COPY . .

# 개발용: uvicorn으로 FastAPI 앱 실행 (main.py 파일의 app 객체를 의미)
# --reload 옵션으로 코드 변경 시 자동 재시작
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# 프로덕션용 CMD 예시 (개발 완료 후 --reload 제거)
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 