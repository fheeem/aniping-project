import { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminChaFLLi } from "../../../components/admin/AdminCha";
import { Quote, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminChaFL = () => {
    const [chaFLs, setChaFLs] = useState([]);
    const [filteredChaFLs, setFilteredChaFLs] = useState([]);
    
    // Filter & Pagination States
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const loadData = async () => {
            const storedData = localStorage.getItem('admin_chaFLs');
            if (storedData) {
                const data = JSON.parse(storedData);
                setChaFLs(data);
            } else {
                try {
                    const response = await axios.get('/data/adminChaLine.json');
                    setChaFLs(response.data);
                    localStorage.setItem('admin_chaFLs', JSON.stringify(response.data));
                } catch (e) {
                    console.error("Failed to load adminChaLine.json:", e);
                }
            }
        };
        loadData();
    }, []);

    // 필터링 로직
    useEffect(() => {
        let result = chaFLs;

        if (searchTerm) {
            result = result.filter(item => 
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.user.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(item => item.status === statusFilter);
        }

        setFilteredChaFLs(result);
        setCurrentPage(1);
    }, [chaFLs, searchTerm, statusFilter]);

    // 페이지네이션 로직
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredChaFLs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredChaFLs.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 액션 핸들러
    const handleApprove = (id) => {
        if (confirm('이 명대사 신청을 승인하시겠습니까?')) {
            const updatedData = chaFLs.map(item => 
                item.id === id ? { ...item, status: 'registered' } : item
            );
            setChaFLs(updatedData);
            localStorage.setItem('admin_chaFLs', JSON.stringify(updatedData));
        }
    };

    const handleReject = (id) => {
        if (confirm('이 명대사 신청을 거절하시겠습니까? (목록에서 삭제됩니다)')) {
            const updatedData = chaFLs.filter(item => item.id !== id);
            setChaFLs(updatedData);
            localStorage.setItem('admin_chaFLs', JSON.stringify(updatedData));
        }
    };

    const handleDelete = (id) => {
        if (confirm('등록된 명대사를 삭제하시겠습니까?')) {
            const updatedData = chaFLs.filter(item => item.id !== id);
            setChaFLs(updatedData);
            localStorage.setItem('admin_chaFLs', JSON.stringify(updatedData));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            Famous Line Requests
                            <Quote className="text-primary" size={28} />
                        </h2>
                        <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">캐릭터 명대사 신청 관리</p>
                    </div>
                </div>

                {/* 필터 및 검색 영역 */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="제목, 내용, 유저 검색..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 focus:outline-none focus:border-primary cursor-pointer"
                        >
                            <option value="all">모든 상태</option>
                            <option value="registered">등록완료</option>
                            <option value="pending">신청대기</option>
                        </select>
                        <select 
                            value={itemsPerPage} 
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 focus:outline-none focus:border-primary cursor-pointer"
                        >
                            <option value={10}>10개씩 보기</option>
                            <option value={15}>15개씩 보기</option>
                            <option value={20}>20개씩 보기</option>
                            <option value={30}>30개씩 보기</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-5 bg-slate-100/80 text-sm font-bold text-slate-500 uppercase tracking-wider text-left">
                        <div className="col-span-1 text-center">Image</div>
                        <div className="col-span-3">Title</div>
                        <div className="col-span-4">Content</div>
                        <div className="col-span-1 text-center">User</div>
                        <div className="col-span-1 text-center">Date</div>
                        <div className="col-span-2 text-center">Status / Actions</div>
                    </div>

                    <ul className="divide-y divide-slate-100">
                        {currentItems.length > 0 ? (
                            currentItems.map(chaFl => (
                                <AdminChaFLLi
                                    key={chaFl.id}
                                    chaFl={chaFl}
                                    onApprove={() => handleApprove(chaFl.id)}
                                    onReject={() => handleReject(chaFl.id)}
                                    onDelete={() => handleDelete(chaFl.id)}
                                />
                            ))
                        ) : (
                            <div className="p-10 text-center text-slate-400">
                                {searchTerm ? "검색 결과가 없습니다." : "데이터가 없습니다."}
                            </div>
                        )}
                    </ul>
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all
                                    ${currentPage === page 
                                    ? 'bg-primary text-white shadow-md scale-105' 
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                {page}
                            </button>
                        ))}

                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChaFL;
