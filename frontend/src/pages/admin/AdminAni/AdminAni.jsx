import { useState, useEffect } from "react";
import axios from "axios";
import { AdminAniLi } from "../../../components/admin/AdminAni";
import { Clapperboard, PlusCircle } from 'lucide-react';
import { Link } from "react-router-dom";

const AdminAni = () => {
    const [anis, setAnis] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            // 1. 로컬 스토리지에서 데이터 확인
            const storedAnis = localStorage.getItem('admin_anis');
            if (storedAnis) {
                setAnis(JSON.parse(storedAnis));
            } else {
                // 2. 없으면 JSON 파일에서 로드 후 로컬 스토리지에 저장
                try {
                    const response = await axios.get('/data/animeInfoData.json');
                    setAnis(response.data);
                    localStorage.setItem('admin_anis', JSON.stringify(response.data));
                } catch (e) {
                    console.error(e);
                }
            }
        };
        loadData();
    }, []);

    // 삭제 기능 추가 (AdminAniLi에서 호출할 수 있도록 props로 전달하거나, 여기서 처리)
    // AdminAniLi는 Link로 감싸져 있지 않고 내부에서 navigate를 사용하므로, 
    // 삭제 버튼 클릭 시 이벤트를 받아 처리하는 것이 좋음.
    // 하지만 AdminAniLi 컴포넌트 구조상 props로 함수를 전달해야 함.

    const handleDeleteAni = (id) => {
        const newAnis = anis.filter(ani => ani.id !== id);
        setAnis(newAnis);
        localStorage.setItem('admin_anis', JSON.stringify(newAnis));
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                Animation Management
                                <Clapperboard className="text-primary" size={28} />
                            </h2>
                            <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">애니메이션 목록 관리</p>
                        </div>
                    </div>
                    <Link to="/AdminAni/edit/new" className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all">
                        <PlusCircle size={18} />
                        <span>신규 등록</span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-5 bg-slate-100/80 text-sm font-bold text-slate-500 uppercase tracking-wider text-left">
                        <div className="col-span-1 text-center">ID</div>
                        <div className="col-span-4">Title</div>
                        <div className="col-span-2">Category</div>
                        <div className="col-span-2">Director</div>
                        <div className="col-span-1 text-center">Episodes</div>
                        <div className="col-span-2 text-center">Actions</div>
                    </div>

                    <ul className="divide-y divide-slate-100">
                        {anis.map(ani =>
                            <AdminAniLi
                                ani={ani}
                                key={ani.id}
                                onDelete={() => handleDeleteAni(ani.id)} // 삭제 함수 전달
                            />
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AdminAni;
