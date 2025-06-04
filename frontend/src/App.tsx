import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import './App.css'; // 기본 App.css는 현재 사용하지 않음

// 생성한 UI 라이브러리별 페이지 컴포넌트 import
import MemoCreatePage from './pages/memo/MemoCreatePage';
import AIExplanationPage from './pages/AIExplanationPage';

function App() {
  return (
    <Routes>
      <Route path="/memo" element={<MemoCreatePage />} />
      <Route path="/" element={<MemoCreatePage />} />
      <Route path="/ai-explanation/:memoId" element={<AIExplanationPage />} />
    </Routes>
  );
}

export default App;
