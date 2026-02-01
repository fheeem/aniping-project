import { useState } from 'react';
import './ChaHistory.css';

const ChaHistory = ({ history }) => {
  const [openInquiryId, setOpenInquiryId] = useState(null);
  const toggleInquiry = (id) => {
    setOpenInquiryId(openInquiryId === id ? null : id);
  };
  return (
    <div className="ChaHistory">
      <h2>문의 내역</h2>
      {history.length > 0 ? (
        <ul>
          <h4 className="hisCategory">
            <span className="historyDate">문의일</span>
            <span>제목/내용 </span>
            <span className="historyStatus">접수 상태</span>
          </h4>
          {history.map((item) => (
            <li key={item.id} onClick={() => toggleInquiry(item.id)}>
              <div className="historyHeader">
                <span className="historyDate">{item.date}</span>
                <span className="historyTitle">{item.title}</span>
                <span>{item.status}</span>
              </div>
              {openInquiryId === item.id && (
                <div className="historyBody">
                  <p>{item.date}</p>
                  <p className="historyContent">{item.content}</p>
                  <span className="historyStatus">{item.status}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>제출된 문의 내역이 없습니다.</p>
      )}
    </div>
  );
};
export default ChaHistory;
