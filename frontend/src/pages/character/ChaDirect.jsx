import { useState } from 'react';
import './ChaDirect.css';

const ChaDirect = ({ onAddInquiry, setActive }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/cs/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          content: content
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('문의가 성공적으로 제출되었습니다.');

        if (onAddInquiry) {
          onAddInquiry(result);
        }

        setTitle('');
        setContent('');
        setActive('questions');
      } else {
        alert('서버 저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버와 통신 중 에러가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까?')) {
      setTitle('');
      setContent('');
      setActive('questions');
    }
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
              disabled={isSubmitting}
          />
          <textarea
              placeholder="내용을 입력해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
          />
        </div>
        <div className="buttons">
          <button
              className="cancel"
              onClick={handleCancel}
              disabled={isSubmitting}
          >
            취소
          </button>
          <button
              className="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
          >
            {isSubmitting ? '제출 중...' : '제출'}
          </button>
        </div>
      </div>
  );
};

export default ChaDirect;