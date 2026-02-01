import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit, ArrowLeft } from 'lucide-react';

const AdminVALiEd = () => {
    const { id } = useParams();
    const [voiceActor, setVoiceActor] = useState(null);
    const [vADetail, setVADetail] = useState(null);
    const navigate = useNavigate();

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

            const foundActor = mainData.find(actor => actor.id === Number(id));
            setVoiceActor(foundActor);

            const foundDetail = detailData.find(vC => vC.id === Number(id));
            setVADetail(foundDetail);
        };
        loadData();
    }, [id]);

    if (!voiceActor || !vADetail) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-semibold">로딩 중...</div>
            </div>
        );
    }

    const handleEditClick = () => {
        navigate(`/Adedit/${voiceActor.id}`);
    }

    const handleGoBack = () => {
        navigate(-1);
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <button onClick={handleGoBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors">
                    <ArrowLeft size={20} />
                    <span>뒤로가기</span>
                </button>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{vADetail.name} 상세 정보</h2>
                <button onClick={handleEditClick} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <Edit size={18} />
                    <span>수정</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex flex-col items-center text-center">
                        <img src={voiceActor.image} alt={voiceActor.name} className="w-32 h-32 object-cover rounded-full shadow-lg mb-4" />
                        <p className="absolute top-12 left-12 bg-primary text-white text-lg font-bold w-10 h-10 flex items-center justify-center rounded-full border-4 border-white">{voiceActor.rank}</p>
                        <h3 className="text-2xl font-bold text-slate-800">{vADetail.name}</h3>
                    </div>
                    <div className="mt-6 text-sm text-slate-600 space-y-3">
                        <div className="flex justify-between"><span className="font-bold text-slate-500">생년월일</span> {vADetail.birth}</div>
                        <div className="flex justify-between"><span className="font-bold text-slate-500">신장</span> {vADetail.stature}</div>
                        <div className="flex justify-between"><span className="font-bold text-slate-500">혈액형</span> {vADetail.blood}</div>
                        <div className="flex justify-between"><span className="font-bold text-slate-500">소속사</span> {vADetail.agency}</div>
                    </div>
                    <div className="mt-6">
                        <h4 className="font-bold text-slate-800 mb-2">프로필</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{vADetail.profile}</p>
                    </div>
                </div>

                {/* Recent Works */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">출연 작품</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {vADetail.aniList.map((vADeta, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center group">
                                <img src={vADeta.aniImg} alt={vADeta.aniTitle} className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-xl transform group-hover:-translate-y-1 transition-all" />
                                <p className="mt-3 font-bold text-slate-700 text-sm">{vADeta.aniTitle}</p>
                                <p className="text-xs text-slate-500">{vADeta.aniname}</p>
                            </div>
                        ))}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 mt-10 mb-6">최근 참여 작품 (이미지)</h3>
                     <div className="flex flex-wrap gap-4">
                        {voiceActor.aniimage.map((aniImg, index) => (
                            <img key={index} src={aniImg} alt={`${voiceActor.name} 작품 이미지 ${index + 1}`} className="w-20 h-28 object-cover rounded-md shadow-sm hover:shadow-lg transition-shadow" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminVALiEd;
