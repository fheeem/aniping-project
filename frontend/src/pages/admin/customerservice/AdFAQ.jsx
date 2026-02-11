import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { HelpCircle, Plus, Edit, Trash2, ChevronDown, Save, X } from 'lucide-react';

const AdFAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [openId, setOpenId] = useState(null);
    const [isEditing, setIsEditing] = useState(null); // 수정 중인 항목 ID (null이면 없음, 'new'면 새 항목)
    const [editForm, setEditForm] = useState({ question: '', answer: '' });

    const fetchData = useCallback(async () =>{
        try{
            const response = await axios.get('/api/AdFAQ/');
            const data = response.data || [];
            setFaqs(data);
        } catch(e){
            console.error('데이터 로드 실패 : ', e);
            setFaqs([]);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    //토글 기능
    const toggleAccordion = (id) => {
        if (isEditing) return; // 수정 중일 때는 토글 방지
        setOpenId(openId === id ? null : id);
    };

    //추가하는 form을 보여주는 영역
    const handleAddClick = () => {
        setIsEditing('new');
        setEditForm({ question: '', answer: '' });
        setOpenId(null); // 다른 아코디언 닫기
    };

    //수정 영역
    const handleEditClick = (e, faq) => {
        e.stopPropagation();
        setIsEditing(faq.faqId);
        setEditForm({ question: faq.question, answer: faq.answer });
        setOpenId(faq.faqId); // 수정할 항목 열기
    };

    //삭제영역
    const handleDeleteClick = async (e, targetId) => {
        e.stopPropagation();
        try{
            await axios.delete(`/api/AdFAQ/Delete/${targetId}`);
            alert('성공적으로 삭제되었습니다.');
            fetchData();
        }catch(e){
            console.error('데이터 삭제 실패' + e);
            alert('서버 오류로 인해 삭제에 실패했습니다.');
        }
    };

    //저장버튼
    const handleSave = async () => {
        if (!editForm.question.trim() || !editForm.answer.trim()) {
            alert('질문과 답변을 모두 입력해주세요.');
            return;
        }
        try{
            if(isEditing === 'new'){
                await axios.post('/api/AdFAQ/Create', {
                                ...editForm,
                                state: 'Y'
                });
                alert('등록되었습니다.');
            } else{
                await axios.put(`/api/AdFAQ/Edit/${isEditing}`, {
                        question: editForm.question,
                        answer: editForm.answer,
                        state: 'Y'
                    });
                alert('수정되었습니다.');
            }
            setIsEditing(null);
            setEditForm({ question: '', answer: '' });
            await fetchData();
        } catch(e){
            console.error('저장에 실패했습니다.' + e);
            alert('저장에 실패했습니다.');
        }

        await fetchData();
        setIsEditing(null);
        setEditForm({ question: '', answer: '' });
    };

    //취소버튼
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
                        <div key={faq.faqId} className={`bg-white rounded-2xl border transition-all ${openId === faq.faqId ? 'border-primary shadow-md' : 'border-slate-200 shadow-sm hover:border-blue-300'}`}>
                            {isEditing === faq.faqId ? (
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
                                        onClick={() => toggleAccordion(faq.faqId)}
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
                                                    onClick={(e) => handleDeleteClick(e, faq.faqId)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <ChevronDown className={`text-slate-400 transition-transform duration-300 ${openId === faq.faqId ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                    <div 
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${openId === faq.faqId ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
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
