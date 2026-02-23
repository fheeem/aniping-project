import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft, Upload, X, ImageIcon } from 'lucide-react';
import AdminVACareer from './AdminVACareer'; // AdminVACareer 컴포넌트

const AdminVALiEd = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = id !== 'new';
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        birth: '',
        height: '',
        bloodType: '?',
        agency: '',
        twitter: '',
        website: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [careers, setCareers] = useState([]); // 출연 작품 목록

    useEffect(() => {
        // 기존 데이터 로드 (API 연동 필요)
        // axios.get(`/api/admin/voiceactors/${id}`).then(res => setFormData(res.data));

        // 이미지 정보 로드
        axios.get(`/api/files?targetType=ACTOR&targetId=${id}`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setProfileImage(res.data[0]);
                }
            })
            .catch(err => console.error("이미지 로드 실패:", err));

        // 출연 작품 목록 로드 (API 연동 필요)
        // axios.get(`/api/admin/voiceactors/${id}/careers`).then(res => setCareers(res.data));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setProfileImage({ file: file });
        }
    };

    const handleImageRemove = () => {
        setProfileImage(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let actorId = id;

            // 1. 성우 정보 저장/수정 (API 연동 필요)
            if (isEditing) {
                // await axios.put(`/api/admin/voiceactors/${id}`, formData);
                alert("성우 정보 수정 완료 (API 호출 생략)");
            } else {
                // const res = await axios.post('/api/admin/voiceactors', formData);
                // actorId = res.data.id;
                actorId = Date.now(); // 임시 ID
                alert("성우 정보 등록 완료 (API 호출 생략)");
            }

            // 2. 프로필 이미지 업로드 (새로 선택한 파일이 있는 경우)
            if (profileImage && profileImage.file) {
                const uploadFormData = new FormData();
                uploadFormData.append('targetType', 'ACTOR');
                uploadFormData.append('targetId', actorId);
                uploadFormData.append('files', profileImage.file);
                // await axios.post('/api/files/upload', uploadFormData);
            }

            // 3. 출연 작품 정보 저장 (API 연동 필요)
            // careers.forEach(async career => { ... });

            navigate('/AdminVA');
        } catch (error) {
            console.error("저장 실패:", error);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    const handleGoBack = () => {
        navigate('/AdminVA');
    }

    const inputClass = "w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition";
    const labelClass = "block text-sm font-bold text-slate-600 mb-2";

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                 <button onClick={handleGoBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors">
                    <ArrowLeft size={20} />
                    <span>목록으로</span>
                </button>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    {isEditing ? `"${formData.name || ''}" 정보 수정` : '신규 성우 등록'}
                </h2>
                <div className="w-24"></div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
                {/* 프로필 이미지 업로드 섹션 */}
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <div className="relative w-48 h-64 bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : profileImage && profileImage.fileUrl ? (
                            <img src={profileImage.fileUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-slate-300 flex flex-col items-center">
                                <ImageIcon size={48} />
                                <span className="text-xs mt-2">이미지 없음</span>
                            </div>
                        )}
                        <button 
                            type="button"
                            onClick={handleImageRemove}
                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        className="hidden" 
                        accept="image/*"
                    />
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current.click()}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                    >
                        <Upload size={18} />
                        이미지 {profileImage ? '변경' : '업로드'}
                    </button>
                    <p className="text-xs text-slate-400 mt-2">권장 사이즈: 300x400 (세로형)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>이름</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div>
                        <label className={labelClass}>생년월일</label>
                        <input type="text" name="birth" value={formData.birth} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>키 (cm)</label>
                        <input type="number" name="height" value={formData.height} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>혈액형</label>
                        <select name="bloodType" value={formData.bloodType} onChange={handleChange} className={inputClass}>
                            <option value="?">모름</option>
                            <option value="A">A형</option>
                            <option value="B">B형</option>
                            <option value="O">O형</option>
                            <option value="AB">AB형</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>소속사</label>
                        <input type="text" name="agency" value={formData.agency} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>트위터 (Twitter)</label>
                        <input type="text" name="twitter" value={formData.twitter} onChange={handleChange} className={inputClass} placeholder="https://twitter.com/..." />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>웹사이트</label>
                        <input type="text" name="website" value={formData.website} onChange={handleChange} className={inputClass} placeholder="https://..." />
                    </div>
                </div>
                
                {/* AdminVACareer 컴포넌트 추가 */}
                {isEditing && <AdminVACareer vaId={id} />}

                <div className="flex justify-end pt-6 border-t">
                    <button type="submit" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all">
                        <Save size={18} />
                        {isEditing ? '수정 완료' : '등록하기'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminVALiEd;
