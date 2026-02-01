import { useState } from 'react';
import './ChaDirect.css';

const ChaDirect = ({ onAddInquiry, setActive }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    onAddInquiry({ title, content });
    setTitle('');
    setContent('');
    alert('문의가 성공적으로 제출되었습니다.');
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setActive('questions');
  };

  return (
    <div className="ChaDirect">
      <h2>1:1 문의</h2>
      <div className="content">
        <input
          type="text"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용을 입력해주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="buttons">
        <button className="cancel" onClick={handleCancel}>취소</button>
        <button className="submit" onClick={handleSubmit}>제출</button>
      </div>
    </div>
  );
};

export default ChaDirect;
