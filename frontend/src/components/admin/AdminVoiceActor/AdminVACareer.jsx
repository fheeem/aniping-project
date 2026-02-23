import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Upload, ImageIcon } from 'lucide-react';

const AdminVACareer = ({ vaId }) => {
    const [careers, setCareers] = useState([]);

    useEffect(() => {
        if (vaId && vaId !== 'new') {
            // 해당 성우의 출연 작품 목록 로드 (가상의 API)
            // axios.get(`/api/admin/voiceactors/${vaId}/careers`).then(res => setCareers(res.data));
            
            // 임시 데이터
            // setCareers([
            //     { id: 1, charName: '캐릭터1', aniTitle: '애니메이션1', image: null, previewUrl: null },
            // ]);
        }
    }, [vaId]);

    const addCareer = () => {
        setCareers([...careers, { id: Date.now(), charName: '', aniTitle: '', image: null, previewUrl: null, isNew: true }]);
    };

    const removeCareer = (id) => {
        if (window.confirm("출연 작품을 삭제하시겠습니까?")) {
            // TODO: 기존 데이터라면 서버 삭제 API 호출
            setCareers(careers.filter(career => career.id !== id));
        }
    };

    const handleInputChange = (id, field, value) => {
        setCareers(careers.map(career => 
            career.id === id ? { ...career, [field]: value } : career
        ));
    };

    const handleImageChange = (id, e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCareers(careers.map(career => 
                career.id === id ? { ...career, image: file, previewUrl: url } : career
            ));
        }
    };

    const handleSave = async () => {
        if (!vaId || vaId === 'new') {
            alert("성우 정보를 먼저 저장해주세요.");
            return;
        }

        try {
            // 1. 출연 작품 정보 저장 및 이미지 업로드
            for (const career of careers) {
                // 신규 등록이거나 수정된 경우 저장 로직 수행 (API 호출 필요)
                
                // 이미지 업로드 (targetType: CHARACTER, targetId: 캐릭터ID - 여기서는 출연작품ID로 가정)
                // 실제로는 출연 작품 테이블이 따로 있거나, 캐릭터 테이블과 연동되어야 함.
                // 여기서는 임시로 CHARACTER 타입을 사용하거나 별도 타입을 정의해야 함.
                if (career.image) {
                    const formData = new FormData();
                    formData.append('targetType', 'CHARACTER'); // 또는 CAREER
                    formData.append('targetId', career.id); 
                    formData.append('files', career.image);

                    await axios.post('/api/files/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            }
            alert("출연 작품 정보가 저장되었습니다.");
        } catch (error) {
            console.error("저장 실패:", error);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">출연 작품 (캐릭터) 관리</h3>
                <button 
                    type="button" 
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-50 text-primary font-bold rounded-lg hover:bg-blue-100 transition-colors"
                >
                    저장
                </button>
            </div>

            <div className="space-y-4">
                {careers.map((career) => (
                    <div key={career.id} className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-200">
                        {/* 이미지 업로드 */}
                        <div className="relative w-24 h-32 bg-white rounded-lg border border-slate-300 flex items-center justify-center overflow-hidden flex-shrink-0 group">
                            {career.previewUrl ? (
                                <img src={career.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="text-slate-300" />
                            )}
                            <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                <Upload size={20} />
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(career.id, e)} />
                            </label>
                        </div>

                        {/* 정보 입력 */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">캐릭터 이름</label>
                                <input 
                                    type="text" 
                                    value={career.charName} 
                                    onChange={(e) => handleInputChange(career.id, 'charName', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                                    placeholder="캐릭터 이름 입력"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">작품명</label>
                                <input 
                                    type="text" 
                                    value={career.aniTitle} 
                                    onChange={(e) => handleInputChange(career.id, 'aniTitle', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                                    placeholder="작품명 입력"
                                />
                            </div>
                        </div>

                        {/* 삭제 버튼 */}
                        <button 
                            onClick={() => removeCareer(career.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}

                <button 
                    type="button"
                    onClick={addCareer}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-primary hover:text-primary hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={20} /> 출연 작품 추가
                </button>
            </div>
        </div>
    );
};

export default AdminVACareer;
