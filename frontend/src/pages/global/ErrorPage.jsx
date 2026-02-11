import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import './ErrorPage.css';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-title">
          Oops!
        </h1>
        <p className="error-message">
          페이지를 찾을 수 없거나<br />
          예상치 못한 오류가 발생했습니다.
        </p>
        <button 
          className="error-button" 
          onClick={handleGoHome}
        >
          <Home size={20} />
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
