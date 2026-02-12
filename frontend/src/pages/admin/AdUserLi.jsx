import { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { AdUserSearch, AdUserSearchList } from "../../components/admin";
import { Users, Search } from 'lucide-react';



const AdUserLi = () => {
    const [searchLis, setSearchLis] = useState([]); //유저 전체 리스트
    const [searchResult, setSearchResult] = useState([]); //검색 필터된 값
    const [realAdmins, setRealAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/AdUserLi');
            const data = response.data || [];
            setSearchLis(data);
            setSearchResult(data); // 데이터 로드 시 결과값도 초기화
        } catch (e) {
            console.error('데이터 로드 실패:', e);
            setSearchResult([]); // 에러 시 빈 리스트로 처리 (정보 없음 출력)
        } finally {
            setIsLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleClickDelete = async (targetId) => {
        try{
            await axios.delete(`/api/AdUserLi/${targetId}`);
            alert('성공적으로 삭제되었습니다.');
            fetchData();
        }catch (e){
            console.error('데이터 삭제 실패' + e);
            alert('서버 오류로 인해 삭제에 실패했습니다.');
        }
    }

    const handleClickRemoveAdmin = async (id) => {
        try{
            const targetUser = searchLis.find(u => u.id === id);
            const newGrade = targetUser.grade === 'ADMIN' ? 'USER' : 'ADMIN';
            await axios.patch(`/api/AdUserLi/${id}`, { grade: newGrade });

            if (typeof fetchData === 'function') {
                await fetchData();
            }

            alert(`권한이 ${newGrade === 'ADMIN' ? '운영자' : '일반유저'}로 변경되었습니다.`);
        } catch(e){
            console.error('권한 변경 실패:', e);
            alert('권한 변경 중 오류가 발생했습니다.');
        }
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
                        {searchResult && searchResult.length > 0 ? (
                            searchResult.map((searchLi, idx) => (
                                <AdUserSearchList
                                    key={searchLi.id}
                                    index={idx}
                                    searchLi={searchLi}
                                    handleClickDelete={handleClickDelete}
                                    handleClickRemoveAdmin={handleClickRemoveAdmin}
                                />
                            ))) : (
                                // 검색 결과가 없거나 400 에러 발생 시 출력될 UI
                                <li className="p-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Search className="text-slate-300" size={48} />
                                        <p className="text-slate-500 font-medium">
                                            검색된 정보가 없거나 요청이 올바르지 않습니다.
                                        </p>
                                        <p className="text-sm text-slate-400">다시 시도해 주세요.</p>
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AdUserLi;
