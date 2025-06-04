import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Memo {
  id: number;
  title: string;
  category: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Explanation {
  id: number;
  ai_content: string;
  created_at: string;
  updated_at: string;
}

interface AIExplanationData {
  memo: Memo;
  explanation: Explanation | null;
  ai_available: boolean;
}

const AIExplanationPage: React.FC = () => {
  const { memoId } = useParams<{ memoId: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<AIExplanationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 메모와 AI 설명 데이터 로드
  const loadData = async () => {
    if (!memoId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/ai/explain-memo/${memoId}`);
      
      if (!response.ok) {
        throw new Error('데이터를 불러올 수 없습니다.');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // AI 설명 생성
  const generateExplanation = async () => {
    if (!memoId) return;
    
    try {
      setGenerating(true);
      setError(null);
      
      const response = await fetch(`/api/ai/explain-memo/${memoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'AI 설명 생성에 실패했습니다.');
      }
      
      const result = await response.json();
      
      // 데이터 업데이트
      if (data) {
        setData({
          ...data,
          explanation: result.explained_term
        });
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 설명 생성 중 오류가 발생했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [memoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">메모를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <span className="text-xl mr-2">←</span>
              메모 목록으로
            </button>
            <h1 className="text-xl font-semibold text-gray-800">AI 설명</h1>
            <div className="w-20"></div> {/* 균형을 위한 빈 공간 */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 원본 메모 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">원본 메모</h2>
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {data.memo.category}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {data.memo.title}
          </h3>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {data.memo.content}
            </p>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            작성일: {new Date(data.memo.created_at).toLocaleString('ko-KR')}
          </div>
        </div>

        {/* AI 설명 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="text-2xl mr-2">🤖</span>
              AI 설명
            </h2>
            
            {data.ai_available ? (
              <button
                onClick={generateExplanation}
                disabled={generating}
                className={`px-4 py-2 rounded-lg font-medium ${
                  generating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {generating ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    생성 중...
                  </span>
                ) : data.explanation ? (
                  '다시 설명하기'
                ) : (
                  'AI 설명 생성'
                )}
              </button>
            ) : (
              <div className="text-sm text-red-500">
                AI 서비스를 사용할 수 없습니다
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <span className="text-red-500 text-xl mr-2">⚠️</span>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {data.explanation ? (
            <div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .markdown-content table {
                      width: 100%;
                      border-collapse: collapse;
                      border: 1px solid #e5e7eb !important;
                      background-color: white !important;
                      margin: 1rem 0;
                      border-radius: 8px;
                      overflow: hidden;
                      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    }
                    .markdown-content thead {
                      background-color: #3b82f6 !important;
                      color: white !important;
                    }
                    .markdown-content tbody {
                      background-color: white !important;
                    }
                    .markdown-content th {
                      padding: 16px 20px;
                      border: 1px solid #d1d5db !important;
                      font-weight: 600;
                      text-align: left;
                      font-size: 14px;
                      text-transform: uppercase;
                      letter-spacing: 0.05em;
                    }
                    .markdown-content td {
                      padding: 16px 20px;
                      border: 1px solid #e5e7eb !important;
                      background-color: white !important;
                      vertical-align: top;
                      line-height: 1.6;
                    }
                    .markdown-content tbody tr:nth-child(even) {
                      background-color: #f9fafb !important;
                    }
                    .markdown-content tbody tr:hover {
                      background-color: #f3f4f6 !important;
                    }
                    .markdown-content tbody tr:nth-child(even):hover {
                      background-color: #e5e7eb !important;
                    }
                  `
                }} />
                <div className="prose prose-sm max-w-none markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {data.explanation.ai_content}
                  </ReactMarkdown>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                AI 설명 생성일: {new Date(data.explanation.created_at).toLocaleString('ko-KR')}
                {data.explanation.updated_at !== data.explanation.created_at && (
                  <span className="ml-2">
                    (수정: {new Date(data.explanation.updated_at).toLocaleString('ko-KR')})
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                아직 AI 설명이 없습니다
              </h3>
              <p className="text-gray-600 mb-4">
                위의 버튼을 클릭하여 AI가 이 메모를 쉽게 설명하도록 해보세요!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIExplanationPage; 