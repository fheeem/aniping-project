import { useState } from "react";
import "./ChaQuestions.css";

const ChaQuestions = () => {
  const [openId, setOpenId] = useState(null);

  const questions = [
    { id: "q1", title: "가입한 아이디를 모르겠어요. 찾을 수 있을까요?", answer: "아이디 찾기 페이지에서 등록한 이메일 또는 휴대폰 번호로 조회할 수 있습니다." },
    { id: "q2", title: "비밀번호를 잊어버렸습니다.", answer: "비밀번호 찾기를 통해 재설정 가능합니다." },
    { id: "q3", title: "회원탈퇴는 어떻게 하나요?", answer: "계정 설정 > 회원탈퇴 메뉴에서 진행하실 수 있습니다." },
    { id: "q4", title: "이 사이트는 어떤 사이트인가요?", answer: "애니메이션 리뷰 및 커뮤니티 서비스 제공 사이트입니다." },
    { id: "q5", title: "무료로 이용 가능한가요?", answer: "회원가입 후 기본 기능은 무료로 사용 가능합니다." }
  ];

  const toggleAnswer = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="ChaQuestions">
      <h2>자주 묻는 질문</h2>
      <ul>
        {questions.map((q) => (
          <li key={q.id}>
            <button
              onClick={() => toggleAnswer(q.id)}
              className={openId === q.id ? "active" : ""}
            >
              {q.title}
              <span className="arrow">{openId === q.id ? "▲" : "▼"}</span>
            </button>
            <div className={`answer ${openId === q.id ? "open" : ""}`}>
              <p>{q.answer}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChaQuestions;
