import { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit, Trash2, ChevronDown, Save, X } from 'lucide-react';

const AdFAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [openId, setOpenId] = useState(null);
    const [isEditing, setIsEditing] = useState(null); // 수정 중인 항목 ID (null이면 없음, 'new'면 새 항목)
    const [editForm, setEditForm] = useState({ question: '', answer: '' });

    useEffect(() => {
        const storedFaqs = localStorage.getItem('admin_faqs');
        if (storedFaqs) {
            setFaqs(JSON.parse(storedFaqs));
        } else {
            // 초기 데이터
            const initialFaqs = [
                { id: 1, question: '회원 탈퇴는 어떻게 하나요?', answer: '마이페이지 > 설정 > 회원 탈퇴 메뉴에서 진행하실 수 있습니다.' },
                { id: 2, question: '비밀번호를 잊어버렸어요.', answer: '로그인 화면의 "비밀번호 찾기"를 통해 이메일 인증 후 재설정 가능합니다.' },
                { id: 3, question: '포인트는 어떻게 적립하나요?', answer: '게시글 작성, 댓글 작성, 출석 체크 등을 통해 포인트를 적립할 수 있습니다.' },
            ];
            setFaqs(initialFaqs);
            localStorage.setItem('admin_faqs', JSON.stringify(initialFaqs));
        }
    }, []);

    const toggleAccordion = (id) => {
        if (isEditing) return; // 수정 중일 때는 토글 방지
        setOpenId(openId === id ? null : id);
    };

    const handleAddClick = () => {
        setIsEditing('new');
        setEditForm({ question: '', answer: '' });
        setOpenId(null); // 다른 아코디언 닫기
    };

    const handleEditClick = (e, faq) => {
        e.stopPropagation();
        setIsEditing(faq.id);
        setEditForm({ question: faq.question, answer: faq.answer });
        setOpenId(faq.id); // 수정할 항목 열기
    };

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        if (confirm('정말로 삭제하시겠습니까?')) {
            const newFaqs = faqs.filter(faq => faq.id !== id);
            setFaqs(newFaqs);
            localStorage.setItem('admin_faqs', JSON.stringify(newFaqs));
            if (openId === id) setOpenId(null);
        }
    };

    const handleSave = () => {
        if (!editForm.question.trim() || !editForm.answer.trim()) {
            alert('질문과 답변을 모두 입력해주세요.');
            return;
        }

        let newFaqs = [...faqs];

        if (isEditing === 'new') {
            const newId = faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1;
            newFaqs.push({ id: newId, ...editForm });
            alert('새로운 질문이 등록되었습니다.');
        } else {
            newFaqs = newFaqs.map(faq => 
                faq.id === isEditing ? { ...faq, ...editForm } : faq
            );
            alert('수정되었습니다.');
        }

        setFaqs(newFaqs);
        localStorage.setItem('admin_faqs', JSON.stringify(newFaqs));
        setIsEditing(null);
        setEditForm({ question: '', answer: '' });
    };

    const handleCancel = () => {
        setIsEditing(null);
        setEditForm({ question: '', answer: '' });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                FAQ Management
                                <HelpCircle className="text-primary" size={28} />
                            </h2>
                            <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">자주 묻는 질문 관리</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <button onClick={handleAddClick} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            <Plus size={18} />
                            <span>질문 추가</span>
                        </button>
                    )}
                </div>

                {/* 새 질문 추가 폼 */}
                {isEditing === 'new' && (
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 mb-8 animate-fadeIn">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">새 질문 작성</h3>
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="질문을 입력하세요" 
                                value={editForm.question}
                                onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary font-bold text-slate-700"
                            />
                            <textarea 
                                placeholder="답변을 입력하세요" 
                                value={editForm.answer}
                                onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary text-slate-600 resize-none"
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={handleCancel} className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 font-bold">취소</button>
                                <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 shadow-sm">저장</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <div key={faq.id} className={`bg-white rounded-2xl border transition-all ${openId === faq.id ? 'border-primary shadow-md' : 'border-slate-200 shadow-sm hover:border-blue-300'}`}>
                            {isEditing === faq.id ? (
                                // 수정 모드
                                <div className="p-6 space-y-4">
                                    <input 
                                        type="text" 
                                        value={editForm.question}
                                        onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary font-bold text-slate-700"
                                    />
                                    <textarea 
                                        value={editForm.answer}
                                        onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary text-slate-600 resize-none"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={handleCancel} className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 font-bold">취소</button>
                                        <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 shadow-sm">저장</button>
                                    </div>
                                </div>
                            ) : (
                                // 보기 모드
                                <>
                                    <div 
                                        onClick={() => toggleAccordion(faq.id)}
                                        className="flex items-center justify-between p-6 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <span className="text-primary font-black text-xl">Q.</span>
                                            <h3 className="font-bold text-slate-800 text-lg">{faq.question}</h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1 mr-2">
                                                <button 
                                                    onClick={(e) => handleEditClick(e, faq)}
                                                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDeleteClick(e, faq.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <ChevronDown className={`text-slate-400 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                    <div 
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="px-6 pb-6 pt-0 pl-16">
                                            <div className="flex gap-4">
                                                <span className="text-slate-400 font-black text-xl">A.</span>
                                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdFAQ;
