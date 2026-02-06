import { useState } from "react";
import "./ChaQuestions.css";

const ChaQuestions = ({ data }) => {
    const [openId, setOpenId] = useState(null);

    const toggleAnswer = (id) => {
        setOpenId(openId === id ? null : id);
    };

    if (!data || data.length === 0) {
        return (
            <div className="ChaQuestions">
                <p className="text-center py-10 text-slate-400 font-bold">검색 결과가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="ChaQuestions">
            <h2>자주 묻는 질문</h2>
            <ul>
                {data.map((q) => (
                    <li key={q.faqId}>
                        <button
                            onClick={() => toggleAnswer(q.faqId)}
                            className={openId === q.faqId ? "active" : ""}
                        >
                            {q.question}
                            <span className="arrow">{openId === q.faqId ? "▲" : "▼"}</span>
                        </button>
                        <div className={`answer ${openId === q.faqId ? "open" : ""}`}>
                            <p>{q.answer}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChaQuestions;