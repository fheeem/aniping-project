import { useState, useEffect } from 'react';
import './ChaHistory.css';

const ChaHistory = () => {
  const [history, setHistory] = useState([]);
  const [openInquiryId, setOpenInquiryId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cs/inquiries')
        .then((response) => response.json())
        .then((data) => {
          setHistory(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('문의 내역 로드 실패:', error);
          setLoading(false);
        });
  }, []);

  const toggleInquiry = (id) => {
    setOpenInquiryId(openInquiryId === id ? null : id);
  };

  if (loading) return <div className="ChaHistory">데이터를 불러오는 중...</div>;

  return (
      <div className="ChaHistory">
        <h2>문의 내역</h2>
        {history.length > 0 ? (
            <ul>
              <li className="hisCategory"> {/* h4 대신 li로 구조 통일 */}
                <span className="historyDate">문의일</span>
                <span className="historyTitle">제목</span>
                <span className="historyStatus">접수 상태</span>
              </li>
              {history.map((item) => (
                  <li key={item.id} onClick={() => toggleInquiry(item.id)}>
                    <div className="historyHeader">
                      {/* 4. DB의 날짜 형식(createdAt)을 잘라서 표시 */}
                      <span className="historyDate">
                  {item.createdAt ? item.createdAt.split('T')[0] : '날짜없음'}
                </span>
                      <span className="historyTitle">{item.title}</span>
                      <span className="historyStatus">접수 완료</span>
                    </div>

                    {openInquiryId === item.id && (
                        <div className="historyBody">
                          <div className="historyContentBox">
                            <p className="contentLabel">[문의 내용]</p>
                            <p className="historyContent">{item.content}</p>
                          </div>
                          <div className="historyReply">
                            <p className="contentLabel">[답변]</p>
                            <p>문의가 정상적으로 접수되었습니다. 담당자가 확인 후 답변드릴 예정입니다.</p>
                          </div>
                        </div>
                    )}
                  </li>
              ))}
            </ul>
        ) : (
            <p className="noData">제출된 문의 내역이 없습니다.</p>
        )}
      </div>
  );
};

export default ChaHistory;