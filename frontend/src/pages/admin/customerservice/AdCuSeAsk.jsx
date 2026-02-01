import { useState, useEffect } from "react";
import axios from "axios";
import { AdCSAskLi } from "../../../components/admin/customerservice";
import { ShieldQuestion } from 'lucide-react';

const AdCuSeAsk = () => {
    const [userAsks, setUserAsks] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get('/data/userAsk.json');
            const data = response.data.userAsk;
            setUserAsks(data);
        } catch (e) {
            console.error('데이터 로드에 실패했습니다.');
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            Customer Inquiries
                            <ShieldQuestion className="text-primary" size={28} />
                        </h2>
                        <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">1:1 문의 관리</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-5 bg-slate-100/80 text-sm font-bold text-slate-500 uppercase tracking-wider text-left">
                        <div className="col-span-1 text-center">No</div>
                        <div className="col-span-5">Title</div>
                        <div className="col-span-2">User</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2 text-center">Status</div>
                    </div>

                    <ul className="divide-y divide-slate-100">
                        {userAsks.map((userAsk, idx) => (
                            <AdCSAskLi
                                key={userAsk.id}
                                userAsks={userAsks}
                                userAsk={userAsk}
                                idx={idx}
                                setUserAsks={setUserAsks}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AdCuSeAsk;
