import React from 'react';
import BottomNavBar from '../../components/layout/BottomNavBar';
import '../../styles/MemoCreatePage.css';

const MemoCreatePage: React.FC = () => {
  const dummyCategories = ['카테고리 A', '카테고리 B', '카테고리 C', '카테고리 D'];
  // The image shows 4 selects, let's assume they can pick from the same list or different ones.
  // For simplicity, we'll use the same list for each of the 4 selects.

  return (
    <div className="memo-page-container">
      <header className="memo-header">
        메모장
      </header>

      <form>
        <div className="form-group">
          <label htmlFor="memo-title">메모 제목</label>
          <input type="text" id="memo-title" placeholder="제목을 입력하세요" />
        </div>

        <div className="form-group">
          <label>메모 카테고리</label>
          <div className="category-selects">
            <select defaultValue="">
              <option value="" disabled>Select</option>
              {dummyCategories.map((cat, index) => (
                <option key={`s1-${index}`} value={cat}>{cat}</option>
              ))}
            </select>
            <select defaultValue="">
              <option value="" disabled>Select</option>
              {dummyCategories.map((cat, index) => (
                <option key={`s2-${index}`} value={cat}>{cat}</option>
              ))}
            </select>
            <select defaultValue="">
              <option value="" disabled>Select</option>
              {dummyCategories.map((cat, index) => (
                <option key={`s3-${index}`} value={cat}>{cat}</option>
              ))}
            </select>
            <select defaultValue="">
              <option value="" disabled>Select</option>
              {dummyCategories.map((cat, index) => (
                <option key={`s4-${index}`} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="memo-content">메모 내용</label>
          <textarea id="memo-content" placeholder="메모를 입력하세요"></textarea>
        </div>

        <div className="buttons-group">
          <button type="button" className="btn-extract">단어 추출</button>
          <button type="button" className="btn-explain">단어 설명</button>
        </div>
      </form>

      <BottomNavBar />
    </div>
  );
};

export default MemoCreatePage; 