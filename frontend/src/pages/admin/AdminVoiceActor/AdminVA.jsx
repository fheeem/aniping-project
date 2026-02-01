import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminVALi } from "../../../components/admin/AdminVoiceActor";
import { Mic, PlusCircle } from 'lucide-react';

const AdminVA = () => {
    const [vCLists, setVCLists] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            const storedVCLists = localStorage.getItem('admin_vCLists');
            if (storedVCLists) {
                setVCLists(JSON.parse(storedVCLists));
            } else {
                try {
                    const response = await axios.get('/data/adminChaCVLi.json');
                    setVCLists(response.data);
                    localStorage.setItem('admin_vCLists', JSON.stringify(response.data));
                } catch (e) {
                    console.error(e);
                }
            }
        };
        loadData();
    }, []);

    const handleCreateClick = () => {
        navigate('/AdNew');
    }

    const handleDelete = (id) => {
        const newVCLists = vCLists.filter(item => item.id !== id);
        setVCLists(newVCLists);
        localStorage.setItem('admin_vCLists', JSON.stringify(newVCLists));
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                Voice Actor Management
                                <Mic className="text-primary" size={28} />
                            </h2>
                            <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">성우 목록 및 참여작 관리</p>
                        </div>
                    </div>
                    <button onClick={handleCreateClick} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all">
                        <PlusCircle size={18} />
                        <span>신규 등록</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-5 bg-slate-100/80 text-sm font-bold text-slate-500 uppercase tracking-wider text-left">
                        <div className="col-span-1 text-center">Rank</div>
                        <div className="col-span-3">Voice Actor</div>
                        <div className="col-span-6">Recent Works</div>
                        <div className="col-span-2 text-center">Actions</div>
                    </div>

                    <ul className="divide-y divide-slate-100">
                        {vCLists.map(vCList =>(
                            <AdminVALi
                                vCList={vCList}
                                key={vCList.id}
                                onDelete={() => handleDelete(vCList.id)}
                            /> 
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AdminVA;
