import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProcessTest() {
  // useNavigate 훅: React Router에서 페이지 이동을 프로그래밍 방식으로 제어할 때 사용합니다.
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    setLoading(true);

    // --- 1. 백엔드로 보낼 데이터 준비 ---
    const userData = {
      userId: 'user123',
      userName: 'TestUser'
    };

    try {
      // --- 2. 백엔드 API 호출 (데이터 전송) ---
      // fetch 함수를 사용하여 POST 요청을 보냅니다.
      // vite.config.js의 proxy 설정 덕분에 '/api/process-user'는 'http://localhost:8080/api/process-user'로 전달됩니다.
      const response = await fetch('/api/process-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // JSON 데이터를 보낸다고 명시
        },
        body: JSON.stringify(userData), // 자바스크립트 객체를 JSON 문자열로 변환하여 전송
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // --- 3. 백엔드로부터 응답 데이터 수신 ---
      // 백엔드가 보낸 JSON 응답을 자바스크립트 객체로 변환합니다.
      const resultData = await response.json();
      console.log('Server Response:', resultData);

      // --- 4. 응답 데이터 확인 및 페이지 이동 (핵심!) ---
      // 백엔드로부터 성공 응답을 받으면, 프론트엔드에서 페이지 이동을 결정합니다.
      if (resultData.status === 'SUCCESS') {
        alert(`처리 성공! 메시지: ${resultData.message}`);

        // navigate 함수를 사용하여 원하는 페이지(여기서는 홈 '/')로 이동합니다.
        // 필요하다면 state 옵션을 통해 다음 페이지로 데이터를 전달할 수도 있습니다.
        navigate('/', { state: { processedData: resultData } });
      } else {
        alert('처리 실패!');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('에러 발생!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid blue', margin: '20px 0' }}>
      <h3>데이터 처리 및 이동 테스트</h3>
      <p>버튼을 누르면 백엔드로 데이터를 보내고, 응답을 받으면 홈으로 이동합니다.</p>
      <button onClick={handleProcess} disabled={loading}>
        {loading ? '처리 중...' : '데이터 전송 및 홈으로 이동'}
      </button>
    </div>
  );
}

export default UserProcessTest;
