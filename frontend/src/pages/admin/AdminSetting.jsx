import { useState, useEffect } from "react";
import axios from "axios";
import { AdminSettingLi } from "../../components/admin";
import { Settings } from 'lucide-react';

const AdminSetting = () => {
    const [takeAdmins, setTakeAdmins] = useState([]);
    const [realAdmins, setRealAdmins] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/AdminSetting');
            const data = response.data || [];
            setTakeAdmins(data);
            const filteredAdmin = data.filter(user => user.grade === 'ADMIN');
            setRealAdmins(filteredAdmin);
        } catch (e) {
            console.error('데이터 로드에 실패했습니다.');
            setTakeAdmins([]);
        }
    }

    const handleClickRemoveAdmin = async (id) => {
        try{
            const targetAdmin = takeAdmins.find(a => a.id === id);
            const newGrade = targetAdmin.grade === 'ADMIN' ? 'USER' : 'ADMIN';
            await axios.patch(`/api/AdminSetting/${id}`, { grade: newGrade });
            await fetchData();
            alert('권한이 변경되었습니다.');
        } catch(e){
            console.error('권한 변경 실패:', e);
            alert('데이터를 로드에 실패했습니다.');
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            Admin Settings
                            <Settings className="text-primary" size={28} />
                        </h2>
                        <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">운영진 목록 및 권한 관리</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-5 bg-slate-100/80 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
                        <div className="col-span-1">No</div>
                        <div className="col-span-2">User ID</div>
                        <div className="col-span-2">Name</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-2">Join Date</div>
                        <div className="col-span-2">Actions</div>
                    </div>

                    <ul className="divide-y divide-slate-100">
                        {realAdmins.map((realAdmin, idx) => (
                            <AdminSettingLi
                                key={realAdmin.id}
                                index={idx}
                                realAdmin={realAdmin}
                                handleClickRemoveAdmin={handleClickRemoveAdmin}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AdminSetting;
