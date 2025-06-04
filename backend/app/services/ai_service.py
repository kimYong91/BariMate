import os
import logging
from typing import Optional

try:
    import google.generativeai as genai
except ImportError:
    genai = None

logger = logging.getLogger(__name__)

# System Instructions (기존 prompts.py 내용을 여기로 이동)
SYSTEM_INSTRUCTIONS = """당신은 메모 내용을 분석하는 전문가입니다.

**역할**: 사용자가 작성한 메모의 핵심 개념들을 식별하고, 해당 분야에 맞는 적절한 설명을 제공합니다.

**응답 형식**: 반드시 아래 6컬럼 마크다운 테이블 형식으로 응답하세요.

| 메모의 핵심 개념 | AI 개선 설명 | 핵심 개념/용어 정의 | 카테고리와의 관련성 | 쉬운 설명 (비유/예시) | 참고 자료 (URL 또는 검색 제안) |
| --------------- | ------------ | ------------------- | ------------------- | -------------------- | ------------------------------ |
| *첫 번째 핵심 개념* | *개선된 설명* | *정확한 정의* | *카테고리 관련성* | *쉬운 설명과 비유* | *참고 URL/검색 제안* |

**지침**:
1. 메모에서 중요한 개념, 용어, 포인트들을 식별하세요.
2. 카테고리와 문맥을 고려하여 해당 분야에 맞는 설명을 제공하세요.
3. 설명은 반드시 사실에 기반해야 하며, 추측이나 확인되지 않은 정보는 포함하지 마세요.
4. 불확실한 정보는 '정보 부족' 또는 '불확실함'이라고 명시하세요.
5. 제공하는 URL은 실제 접근 가능하고 신뢰할 수 있는 출처여야 합니다.
"""


class AIService:
    def __init__(self):
        """Gemini AI 서비스 초기화"""
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = None
        
        if not self.api_key:
            logger.warning("GEMINI_API_KEY가 설정되지 않았습니다. AI 기능이 비활성화됩니다.")
            return
            
        if genai is None:
            logger.error("google-generativeai 패키지가 설치되지 않았습니다.")
            return
            
        try:
            genai.configure(api_key=self.api_key)
            # System Instructions와 함께 모델 초기화
            self.model = genai.GenerativeModel(
                model_name='gemini-1.5-flash',
                system_instruction=SYSTEM_INSTRUCTIONS
            )
            logger.info("Gemini AI 서비스가 System Instructions와 함께 초기화되었습니다.")
        except Exception as e:
            logger.error(f"Gemini AI 서비스 초기화 실패: {e}")

    def is_available(self) -> bool:
        """AI 서비스 사용 가능 여부 확인"""
        return self.model is not None

    async def explain_memo(self, memo_content: str, memo_title: str = "", memo_category: str = "") -> Optional[str]:
        """
        메모 내용을 체계적으로 설명하는 AI 응답 생성
        
        Args:
            memo_content: 메모 내용
            memo_title: 메모 제목 (선택사항)
            memo_category: 메모 카테고리 (선택사항)
            
        Returns:
            AI가 생성한 설명 텍스트 또는 None (실패 시)
        """
        if not self.is_available():
            logger.warning("AI 서비스를 사용할 수 없습니다.")
            return None
            
        try:
            # 간소화된 프롬프트 - 메모 내용과 카테고리만 전송
            prompt = f"카테고리: {memo_category or '일반'}\n\n메모 내용:\n{memo_content}"
            
            logger.info(f"AI 설명 요청 - 카테고리: {memo_category}, 내용 길이: {len(memo_content)}자")
            
            # AI 응답 생성 (System Instructions 자동 적용)
            response = self.model.generate_content(prompt)
            
            if response and response.text:
                logger.info(f"AI 설명 생성 완료 (길이: {len(response.text)}자)")
                return response.text.strip()
            else:
                logger.warning("AI 응답이 비어있습니다.")
                return None
                
        except Exception as e:
            logger.error(f"AI 설명 생성 중 오류 발생: {e}")
            return None


# 싱글톤 인스턴스
ai_service = AIService() 