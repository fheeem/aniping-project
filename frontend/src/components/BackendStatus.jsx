import React, { useState, useEffect } from 'react';

function BackendStatus() {
  const [status, setStatus] = useState('Checking backend status...');

  useEffect(() => {
    // 백엔드의 상태를 체크할 수 있는 간단한 엔드포인트를 호출합니다.
    // 예를 들어, Spring Boot Actuator의 /health 엔드포인트를 사용할 수 있습니다.
    // 여기서는 /api/health 라고 가정하겠습니다.
    fetch('/api/health')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        setStatus(`Backend is UP: ${data.status}`);
      })
      .catch(error => {
        console.error('Error fetching backend status:', error);
        setStatus('Backend is DOWN or not reachable.');
      });
  }, []);

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
      <h4>Backend Connection Test</h4>
      <p>{status}</p>
    </div>
  );
}

export default BackendStatus;
