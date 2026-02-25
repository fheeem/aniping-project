import { useState } from "react";
import axios from "axios";
import { ChevronDown, CheckCircle, MessageSquare, Save } from 'lucide-react';
import { useUser } from '../../../context/UserContext'; // useUser import

const AdCSAskLi = ({ userAsks, userAsk, idx, setUserAsks }) => {
    const { userInfo } = useUser(); // UserContext에서 userInfo 가져오기
    const [isVisible, setIsVisible] = useState(false);
    const [ansTitleInput, setAnsTitleInput] = useState('');
    const [ansInput, setAnsInput] = useState('');

    const visibleContent = () => {
        setIsVisible(!isVisible);
    };

    const handleChangeAnsTitle = (e) => {
        setAnsTitleInput(e.target.value)
    }

    const handleChangeAns = (e) => {
        setAnsInput(e.target.value)
    }

    const handleSave = async () => {
        if (!ansTitleInput.trim() || !ansInput.trim()) {
            alert('답변 제목과 내용을 모두 입력해주세요.');
            return;
        }

        // UserContext에서 관리자 정보 확인
        if (!userInfo || !userInfo.id) {
            alert("관리자 로그인 정보가 없습니다.");
            return;
        }

        try{
            // API 호출 (경로는 백엔드 구현에 따라 다를 수 있음, 현재는 기존 코드 유지)
            // 백엔드에서 adminId를 받을 수 있도록 DTO나 파라미터 수정이 필요할 수 있음
            const response = await axios.put(`/api/AdCuSeAsk/Edit/${userAsk.id}`, {
                ansTitle: ansTitleInput,
                ansContent: ansInput,
                adminId: userInfo.id // userInfo.id 사용
            });
            
            if (response.status === 200) {
                const changeUserAsk = userAsks.map(userA =>
                    userA.id === userAsk.id
                    ? {...userA, ansTitle: ansTitleInput, ansContent: ansInput, status: true}
                    : userA);
                setUserAsks(changeUserAsk);
                alert('성공적으로 저장되었습니다!');
                setIsVisible(false);
            }
        }catch(e){
            console.error("저장 중 에러 발생:", e);
            alert("DB 저장에 실패했습니다.");
        }
    }

    return (
        <li className="AdCSAskLi">
            <div 
                className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-50/50 transition-colors cursor-pointer text-left"
                onClick={visibleContent}
            >
                <div className="col-span-1 text-center font-medium text-slate-500">{idx + 1}</div>
                <div className="col-span-5 font-bold text-slate-800 truncate">{userAsk.title}</div>
                <div className="col-span-2 text-slate-600">{userAsk.userName}</div>
                <div className="col-span-2 text-slate-500 text-sm">{userAsk.createAt}</div>
                <div className="col-span-2 flex items-center justify-center gap-2">
                    {userAsk.status ? (
                        <span className="flex items-center gap-1.5 text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                            <CheckCircle size={16} />
                            처리완료
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 text-sm font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                            <MessageSquare size={16} />
                            답변대기
                        </span>
                    )}
                    <ChevronDown className={`text-slate-400 transition-transform ${isVisible ? 'rotate-180' : ''}`} />
                </div>
            </div>
            
            {isVisible && (
                <div className="bg-slate-50 p-6 border-t border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 문의 내용 */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">문의 내용</h3>
                            <p className="text-slate-600 whitespace-pre-wrap">{userAsk.content}</p>
                        </div>

                        {/* 답변 영역 */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            {userAsk.status ? (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">답변 완료</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="font-semibold text-slate-700">답변 제목</p>
                                            <p className="text-slate-600 mt-1">{userAsk.ansTitle}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-700">답변 내용</p>
                                            <p className="text-slate-600 mt-1 whitespace-pre-wrap">{userAsk.ansContent}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-800">답변 작성</h3>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-1">답변 제목</label>
                                        <input
                                            type="text"
                                            placeholder="제목을 입력하세요."
                                            value={ansTitleInput}
                                            onChange={handleChangeAnsTitle}
                                            className="w-full px-4 py-2 rounded-lg bg-slate-100 border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-1">답변 내용</label>
                                        <textarea
                                            placeholder="내용을 입력하세요"
                                            value={ansInput}
                                            onChange={handleChangeAns}
                                            rows={5}
                                            className="w-full px-4 py-2 rounded-lg bg-slate-100 border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={handleSave}
                                            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                        >
                                            <Save size={16} />
                                            저장하기
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </li>
    )
}

export default AdCSAskLi;
