TERM_EXPLANATION_PROMPT = """주제: {topic}
설명할 용어: {terms} # 사용자가 입력한 용어 목록 (쉼표로 구분 가능)

**지침:**
1.  사용자가 입력한 각 용어 ( `{terms}` 내의 각 항목)에 대해, 아래 **요청 정보**와 **Markdown 테이블 예시 형식**에 맞춰 한국어로 Markdown 테이블을 생성해줘.
2.  각 용어 처리 시, **주제({topic})와 문맥을 고려하여 사용자의 입력에 명백한 오타가 있거나 더 적절한 표준 용어가 있다면 'AI 추천/수정 용어'란에 수정된 용어를 제시**해줘. 수정이 필요 없다고 판단되면 '사용자 입력 용어'와 동일하게 'AI 추천/수정 용어'를 사용해줘.
3.  **설명은 반드시 'AI 추천/수정 용어'를 기준으로 사실에 기반해야 하며, 추측이나 확인되지 않은 정보는 절대 포함하지 마세요.**
4.  만약 특정 'AI 추천/수정 용어'에 대한 정확한 정보를 찾기 어렵거나 그 의미가 불확실하다면, 해당 용어 설명란에 **'정보 부족' 또는 '불확실함'이라고 명확히 명시**해줘.
5.  불확실하다고 명시한 경우, 주어진 주제와 다른 용어들과의 관계를 고려했을 때 **어떤 의미로 추정되는지 조심스럽게 덧붙여 설명**할 수는 있어. (예: "정확한 정보는 없으나, {topic} 주제 및 다른 용어와의 관계로 볼 때 ...일 가능성이 있습니다.")
6.  **절대로 없는 용어나 개념을 만들어내지 마세요.** 모르면 모른다고 하거나, 위 지침에 따라 불확실함을 표현해줘.
7.  제공하는 URL은 실제 접근 가능하고 신뢰할 수 있는 출처여야 해.

**요청 정보 (AI 추천/수정 용어 기준):**
*   **용어 정의**: \'AI 추천/수정 용어\'의 핵심 정의
*   **주제와의 관련성**: \'AI 추천/수정 용어\'가 제시된 주제와 어떤 관련이 있는지 간략한 설명
*   **참고 자료 (URL)**: \'AI 추천/수정 용어\'에 대해 더 자세히 알아볼 수 있는 신뢰할 수 있는 공개 URL (예: 위키백과, 공식 문서, 기술 블로그 등). 직접적인 URL 제공이 어렵다면, 어떤 종류의 자료를 찾아보면 좋을지 제안 (예: "[기술명] 공식 문서 검색 제안").

**Markdown 테이블 예시 형식:**

| 사용자 입력 용어 | AI 추천/수정 용어 | 용어 정의                          | 주제와의 관련성                       | 참고 자료 (URL 또는 검색 제안)     |
| --------------- | ----------------- | ---------------------------------- | ------------------------------------- | ---------------------------------- |
| *사용자가 입력한 첫 번째 용어* | *AI가 판단한 정확하거나 수정된 첫 번째 용어* | *AI 추천/수정 용어의 핵심 정의*     | *AI 추천/수정 용어와 주제의 관련성 설명*      | *AI 추천/수정 용어 관련 참고 URL/검색 제안* |
| *사용자가 입력한 두 번째 용어* | *AI가 판단한 정확하거나 수정된 두 번째 용어* | *AI 추천/수정 용어의 핵심 정의*     | *AI 추천/수정 용어와 주제의 관련성 설명*      | *AI 추천/수정 용어 관련 참고 URL/검색 제안* |
| ...             | ...               | ...                                | ...                                   | ...                                |

결과는 명확하고 이해하기 쉽게, 그리고 **신뢰할 수 있도록** 작성해줘."""

# 여기에 다른 프롬프트들을 추가할 수 있습니다.
# 예: SUMMARY_PROMPT = "다음 내용을 요약해줘: {text}" 