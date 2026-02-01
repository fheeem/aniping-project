import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react';

const AdVaLiEdBtn = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = id !== undefined;

    const [formData, setFormData] = useState({
        rank: '',
        image: '',
        name: '',
        birth: '',
        stature: '',
        blood: '',
        agency: '',
        profile: '',
        aniList: [],
        aniimage: []
    });

    useEffect(() => {
        const loadData = async () => {
            // 1. 메인 리스트 데이터 로드
            let mainData = [];
            const storedVCLists = localStorage.getItem('admin_vCLists');
            if (storedVCLists) {
                mainData = JSON.parse(storedVCLists);
            } else {
                try {
                    const response = await axios.get('/data/adminChaCVLi.json');
                    mainData = response.data;
                    localStorage.setItem('admin_vCLists', JSON.stringify(mainData));
                } catch (e) {
                    console.error(e);
                }
            }

            // 2. 상세 데이터 로드
            let detailData = [];
            const storedVADetails = localStorage.getItem('admin_vADetails');
            if (storedVADetails) {
                detailData = JSON.parse(storedVADetails);
            } else {
                try {
                    const response = await axios.get('/data/adminVoiceActor.json');
                    detailData = response.data;
                    localStorage.setItem('admin_vADetails', JSON.stringify(detailData));
                } catch (e) {
                    console.error(e);
                }
            }

            if (isEditing) {
                const foundMain = mainData.find(actor => actor.id === Number(id));
                const foundDetail = detailData.find(vC => vC.id === Number(id));

                if (foundMain && foundDetail) {
                    setFormData({
                        rank: foundMain.rank,
                        image: foundMain.image,
                        name: foundDetail.name,
                        birth: foundDetail.birth,
                        stature: foundDetail.stature,
                        blood: foundDetail.blood,
                        agency: foundDetail.agency,
                        profile: foundDetail.profile,
                        aniList: foundDetail.aniList,
                        aniimage: foundMain.aniimage
                    });
                }
            }
        };
        loadData();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleAniListChange = (index, e) => {
        const { name, value } = e.target;
        const newAniList = [...formData.aniList];
        newAniList[index] = { ...newAniList[index], [name]: value };
        setFormData(prevData => ({ ...prevData, aniList: newAniList }));
    };

    const addAniItem = () => {
        setFormData(prevData => ({
            ...prevData,
            aniList: [...prevData.aniList, { aniImg: '', aniTitle: '', aniname: '' }]
        }));
    };

    const removeAniItem = (index) => {
        const newAniList = formData.aniList.filter((_, i) => i !== index);
        setFormData(prevData => ({ ...prevData, aniList: newAniList }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const storedVCLists = localStorage.getItem('admin_vCLists');
        const storedVADetails = localStorage.getItem('admin_vADetails');
        let mainData = storedVCLists ? JSON.parse(storedVCLists) : [];
        let detailData = storedVADetails ? JSON.parse(storedVADetails) : [];

        // aniimage 배열 생성 (aniList의 aniImg만 추출)
        const newAniImages = formData.aniList.map(item => item.aniImg).filter(img => img);

        if (isEditing) {
            // 메인 데이터 업데이트
            mainData = mainData.map(item => 
                item.id === Number(id) 
                ? { ...item, rank: formData.rank, image: formData.image, name: formData.name, aniimage: newAniImages } 
                : item
            );
            // 상세 데이터 업데이트
            detailData = detailData.map(item => 
                item.id === Number(id) 
                ? { ...item, name: formData.name, birth: formData.birth, stature: formData.stature, blood: formData.blood, agency: formData.agency, profile: formData.profile, aniList: formData.aniList } 
                : item
            );
            alert("수정되었습니다.");
        } else {
            // 신규 등록
            const newId = mainData.length > 0 ? Math.max(...mainData.map(item => item.id)) + 1 : 1001;
            
            mainData.push({
                id: newId,
                rank: formData.rank,
                image: formData.image,
                name: formData.name,
                aniimage: newAniImages
            });

            detailData.push({
                id: newId,
                name: formData.name,
                birth: formData.birth,
                stature: formData.stature,
                blood: formData.blood,
                agency: formData.agency,
                profile: formData.profile,
                aniList: formData.aniList
            });
            alert("추가되었습니다.");
        }

        localStorage.setItem('admin_vCLists', JSON.stringify(mainData));
        localStorage.setItem('admin_vADetails', JSON.stringify(detailData));

        if (isEditing) {
            navigate(`/AdminVALiEd/${id}`);
        } else {
            navigate(`/AdminVA`);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    }

    const inputClass = "w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition";
    const labelClass = "block text-sm font-bold text-slate-600 mb-2";

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                 <button onClick={handleGoBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors">
                    <ArrowLeft size={20} />
                    <span>뒤로가기</span>
                </button>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    {isEditing ? `"${formData.name}" 정보 수정` : '신규 성우 등록'}
                </h2>
                <div className="w-24"></div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>이름</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div>
                        <label className={labelClass}>순위</label>
                        <input type="number" name="rank" value={formData.rank} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>성우 이미지 URL</label>
                        <input type="text" name="image" value={formData.image} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>생년월일</label>
                        <input type="text" name="birth" value={formData.birth} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>신장</label>
                        <input type="text" name="stature" value={formData.stature} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>혈액형</label>
                        <input type="text" name="blood" value={formData.blood} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>소속사</label>
                        <input type="text" name="agency" value={formData.agency} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>프로필</label>
                        <textarea name="profile" value={formData.profile} onChange={handleChange} className={`${inputClass} h-32`}></textarea>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-slate-700 mb-4 border-t pt-6">참여 작품</h3>
                    <div className="space-y-4">
                        {formData.aniList.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-slate-50 p-4 rounded-lg">
                                <input type="text" name="aniImg" value={item.aniImg} onChange={(e) => handleAniListChange(index, e)} placeholder="작품 이미지 URL" className={inputClass} />
                                <input type="text" name="aniTitle" value={item.aniTitle} onChange={(e) => handleAniListChange(index, e)} placeholder="작품 제목" className={inputClass} />
                                <input type="text" name="aniname" value={item.aniname} onChange={(e) => handleAniListChange(index, e)} placeholder="배역 이름" className={inputClass} />
                                <button type="button" onClick={() => removeAniItem(index)} className="flex items-center justify-center gap-2 text-sm font-bold text-red-500 bg-red-100 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors">
                                    <Trash2 size={14} />
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addAniItem} className="mt-4 flex items-center gap-2 text-sm font-bold text-primary bg-blue-100 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                        <Plus size={16} />
                        작품 추가
                    </button>
                </div>

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

export default AdVaLiEdBtn;