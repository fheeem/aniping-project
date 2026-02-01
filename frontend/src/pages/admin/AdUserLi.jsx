import { useState, useEffect } from "react";
import axios from 'axios';
import { AdUserSearch, AdUserSearchList } from "../../components/admin";
import { Users, Search } from 'lucide-react';

const AdUserLi = () => {
    const [searchLis, setSearchLis] = useState([]); //유저 전체 리스트
    const [searchResult, setSearchResult] = useState([]); //검색 필터된 값
    const [realAdmins, setRealAdmins] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/data/userInfo.json');
            const data = response.data.userInfo;
            setSearchLis(data);
            setSearchResult(data);
            const filteredAdmin = data.filter(dat => dat.admin === true);
            setRealAdmins(filteredAdmin);
        } catch (e) {
            console.error('데이터 로드에 실패했습니다.');
        }
    };

    const handleClickDelete = (targetId) => {
        const deleteUser = searchLis.filter((data) => data.id !== targetId);
        setSearchLis(deleteUser);
        setSearchResult(deleteUser);  
    }

    const handleClickRemoveAdmin = (id) => {
        const updateAdmins = searchLis.map(searchLi =>
            searchLi.id === id ? { ...searchLi, admin: !searchLi.admin } : searchLi)
        setSearchLis(updateAdmins)
        setSearchResult(updateAdmins)
        setRealAdmins(updateAdmins.filter(updateAdmin => updateAdmin.admin === true));
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            User Management
                            <Users className="text-primary" size={28} />
                        </h2>
                        <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">사용자 목록 및 권한 관리</p>
                    </div>
                </div>

                <AdUserSearch
                    searchLis={searchLis}
                    setSearchResult={setSearchResult}
                />

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-8">
                    <div className="grid grid-cols-12 gap-4 p-5 bg-slate-100/80 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
                        <div className="col-span-1">No</div>
                        <div className="col-span-2">User ID</div>
                        <div className="col-span-2">Name</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-2">Join Date</div>
                        <div className="col-span-2">Actions</div>
                    </div>

                    <ul className="divide-y divide-slate-100">
                        {searchResult.map((searchLi, idx) => (
                            <AdUserSearchList
                                key={searchLi.id}
                                index={idx}
                                searchLi={searchLi}
                                handleClickDelete={handleClickDelete}
                                handleClickRemoveAdmin={handleClickRemoveAdmin}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AdUserLi;
