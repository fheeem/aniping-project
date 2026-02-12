import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AdCSAskLi } from "../../../components/admin/customerservice";
import { ShieldQuestion } from 'lucide-react';

const AdCuSeAsk = () => {
    const [userAsks, setUserAsks] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [filteredRequests, setFilteredRequests] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('/api/AdCuSeAsk');
            const data = Array.isArray(response.data) ? response.data : [];
            setUserAsks(data);
            setFilteredRequests(data);
        } catch (e) {
            console.error('데이터 로드에 실패했습니다.');
            setUserAsks([]);
            setFilteredRequests([]);
        }
    },[]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        let result = [...userAsks];

        if (statusFilter === 'Unresolved') {
            result = result.filter(req => req.status === false);
        } else if (statusFilter === 'resolved') {
            result = result.filter(req => req.status === true);
        }

        setFilteredRequests(result);
    }, [userAsks, statusFilter]);

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
                <div className="flex justify-end mb-8">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 focus:outline-none focus:border-primary cursor-pointer"
                        >
                        <option value="all">전체</option>
                        <option value="Unresolved">답변대기</option>
                        <option value="resolved">처리완료</option>
                    </select>
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
                        {Array.isArray(filteredRequests) && filteredRequests.length > 0 ? (
                            filteredRequests.map((userAsk, idx) => (
                                <AdCSAskLi
                                    key={userAsk.id}
                                    userAsks={userAsks}
                                    userAsk={userAsk}
                                    idx={idx}
                                    setUserAsks={setUserAsks}
                                 />
                            ))
                        ) : (
                            <li className="p-10 text-center text-slate-400 font-medium">
                                해당하는 문의 내역이 없습니다.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AdCuSeAsk;
