import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserPlus, CheckCircle, XCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminChaBoard = () => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    
    // Filter & Pagination States
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 상태 필터 추가
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const loadData = async () => {
            const storedRequests = localStorage.getItem('admin_chaRequests');
            if (storedRequests) {
                const data = JSON.parse(storedRequests);
                setRequests(data);
                setFilteredRequests(data);
            } else {
                try {
                    const response = await axios.get('/data/adminChaRequest.json');
                    setRequests(response.data);
                    setFilteredRequests(response.data);
                    localStorage.setItem('admin_chaRequests', JSON.stringify(response.data));
                } catch (e) {
                    console.error(e);
                }
            }
        };
        loadData();
    }, []);

    // 필터링 로직
    useEffect(() => {
        let result = requests;

        // 검색어 필터
        if (searchTerm) {
            result = result.filter(req => 
                req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.anime.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 상태 필터
        if (statusFilter !== 'all') {
            result = result.filter(req => req.status === statusFilter);
        }

        setFilteredRequests(result);
        setCurrentPage(1);
    }, [requests, searchTerm, statusFilter]);

    // 페이지네이션 로직
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 액션 핸들러
    const handleApprove = (id) => {
        if (confirm('이 캐릭터 신청을 승인하시겠습니까?')) {
            const updatedRequests = requests.map(req => 
                req.id === id ? { ...req, status: 'registered' } : req
            );
            setRequests(updatedRequests);
            localStorage.setItem('admin_chaRequests', JSON.stringify(updatedRequests));
        }
    };

    const handleReject = (id) => {
        if (confirm('이 캐릭터 신청을 거절하시겠습니까? (목록에서 삭제됩니다)')) {
            const updatedRequests = requests.filter(req => req.id !== id);
            setRequests(updatedRequests);
            localStorage.setItem('admin_chaRequests', JSON.stringify(updatedRequests));
        }
    };

    const handleDelete = (id) => {
        if (confirm('등록된 캐릭터를 삭제하시겠습니까?')) {
            const updatedRequests = requests.filter(req => req.id !== id);
            setRequests(updatedRequests);
            localStorage.setItem('admin_chaRequests', JSON.stringify(updatedRequests));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            Character Requests
                            <UserPlus className="text-primary" size={28} />
                        </h2>
                        <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">캐릭터 게시판 신청 관리</p>
                    </div>
                </div>

                {/* 필터 및 검색 영역 */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="캐릭터명 또는 애니명 검색..." 
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
                    <div className="grid grid-cols-12 gap-4 p-5 bg-slate-100/80 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
                        <div className="col-span-1">No</div>
                        <div className="col-span-3 text-left pl-4">Character</div>
                        <div className="col-span-3 text-left">Anime</div>
                        <div className="col-span-2">User</div>
                        <div className="col-span-1">Date</div>
                        <div className="col-span-2">Status / Actions</div>
                    </div>

                    <ul className="divide-y divide-slate-100">
                        {currentItems.map((req, idx) => (
                            <li key={req.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-50/50 transition-colors text-center">
                                <div className="col-span-1 text-slate-500 font-medium">{req.id}</div>
                                <div className="col-span-3 text-left pl-4 font-bold text-slate-800">{req.name}</div>
                                <div className="col-span-3 text-left text-slate-600">{req.anime}</div>
                                <div className="col-span-2 text-slate-500 text-sm">{req.user}</div>
                                <div className="col-span-1 text-slate-400 text-sm">{req.date}</div>
                                <div className="col-span-2 flex items-center justify-center gap-2">
                                    {req.status === 'registered' ? (
                                        <>
                                            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2.5 py-1 rounded-full mr-2">
                                                <CheckCircle size={12} /> 등록완료
                                            </span>
                                            <button 
                                                onClick={() => handleDelete(req.id)}
                                                className="p-2 text-slate-400 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors"
                                                title="삭제"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full mr-2">
                                                신청대기
                                            </span>
                                            <button 
                                                onClick={() => handleApprove(req.id)}
                                                className="p-2 text-slate-400 hover:bg-green-100 hover:text-green-600 rounded-full transition-colors"
                                                title="승인"
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleReject(req.id)}
                                                className="p-2 text-slate-400 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors"
                                                title="거절"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    
                    {currentItems.length === 0 && (
                        <div className="p-10 text-center text-slate-400">
                            데이터가 없습니다.
                        </div>
                    )}
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

export default AdminChaBoard;
