import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, ArrowLeft } from 'lucide-react';

const AdminAniLiEd = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [thisAni, setThisAni] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            // 1. 로컬 스토리지에서 데이터 확인
            const storedAnis = localStorage.getItem('admin_anis');
            let anis = [];
            
            if (storedAnis) {
                anis = JSON.parse(storedAnis);
            } else {
                // 2. 없으면 JSON 파일에서 로드
                try {
                    const response = await axios.get('/data/animeInfoData.json');
                    anis = response.data;
                    localStorage.setItem('admin_anis', JSON.stringify(anis));
                } catch (e) {
                    console.error(e);
                }
            }

            const data = anis.find(item => item.id === Number(id));
            setThisAni(data);
        };
        loadData();
    }, [id])

    if (!thisAni) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-semibold">로딩 중...</div>
            </div>
        );
    }

    const handleEditClick = () => {
        navigate(`/AdminAni/edit/${id}`);
    }

    const handleGoBack = () => {
        navigate('/AdminAni');
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <button onClick={handleGoBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors">
                    <ArrowLeft size={20} />
                    <span>목록으로</span>
                </button>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight truncate max-w-2xl">{thisAni.title} 상세 정보</h2>
                <button onClick={handleEditClick} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <Edit size={18} />
                    <span>수정</span>
                </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Image */}
                    <div className="md:col-span-1">
                        <img src={thisAni.infoImg} alt={thisAni.title} className="w-full h-auto object-cover rounded-lg shadow-md" />
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-4xl font-bold text-slate-800 mb-4">{thisAni.title}</h3>
                        
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-lg">
                            <div className="flex items-center">
                                <strong className="w-24 text-slate-500 font-semibold">감독</strong>
                                <span className="text-slate-700">{thisAni.director}</span>
                            </div>
                            <div className="flex items-center">
                                <strong className="w-24 text-slate-500 font-semibold">스튜디오</strong>
                                <span className="text-slate-700">{thisAni.studio}</span>
                            </div>
                            <div className="flex items-center">
                                <strong className="w-24 text-slate-500 font-semibold">장르</strong>
                                <span className="text-slate-700">{thisAni.genre}</span>
                            </div>
                            <div className="flex items-center">
                                <strong className="w-24 text-slate-500 font-semibold">방영일</strong>
                                <span className="text-slate-700">{thisAni.airDate}</span>
                            </div>
                            <div className="flex items-center">
                                <strong className="w-24 text-slate-500 font-semibold">연령</strong>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                    {thisAni.rating}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminAniLiEd;
