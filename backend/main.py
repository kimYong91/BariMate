from fastapi import FastAPI
# from .prompts import TERM_EXPLANATION_PROMPT # 만약 prompts.py를 사용한다면

app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "BariMate Backend"}

# AI 관련 엔드포인트 등