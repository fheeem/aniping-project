import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Link 추가
import axios from 'axios';
import { Megaphone, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const Notice = () => {
    const [notices, setNotices] = useState([]);
    const [filteredNotices, setFilteredNotices] = useState([]);
    
    // Filter & Pagination States
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const loadData = async () => {
            const storedNotices = localStorage.getItem('admin_notices');
            if (storedNotices) {
                setNotices(JSON.parse(storedNotices));
            } else {
                try {
                    const response = await axios.get('/data/noticeData.json');
                    setNotices(response.data);
                    localStorage.setItem('admin_notices', JSON.stringify(response.data));
                } catch (e) {
                    console.error("Failed to load notice data", err);
                }
            }
        };
        loadData();
    }, []);

    // 필터링 로직
    useEffect(() => {
        let result = notices;

        if (searchTerm) {
            result = result.filter(notice => 
                notice.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredNotices(result);
        setCurrentPage(1);
    }, [notices, searchTerm]);

    // 페이지네이션 로직
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredNotices.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                Notice
                                <Megaphone className="text-primary" size={24} />
                            </h2>
                            <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">공지사항</p>
                        </div>
                    </div>
                </div>

                {/* 필터 및 검색 영역 */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="제목으로 검색..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                        />
                    </div>

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

                <div className="bg-white rounded-[2rem] shadow-sm border border-blue-50/50 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-6 bg-slate-50/50 border-b border-blue-50 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
                        <div className="col-span-1">No</div>
                        <div className="col-span-8 text-left pl-4">Title</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-1">Views</div>
                    </div>

                    {currentItems.length > 0 ? (
                        <ul className="divide-y divide-blue-50">
                            {currentItems.map((notice, index) => (
                                <li key={notice.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-50/50 transition-colors text-center group">
                                    <div className="col-span-1 text-slate-500 font-medium">
                                        {filteredNotices.length - (indexOfFirstItem + index)}
                                    </div>
                                    <div className="col-span-8 text-left pl-4 font-bold text-slate-700 text-base truncate">
                                        <Link to={`/notice/${notice.id}`} className="hover:text-primary transition-colors">
                                            {notice.title}
                                        </Link>
                                    </div>
                                    <div className="col-span-2 text-sm text-slate-400">
                                        {notice.date}
                                    </div>
                                    <div className="col-span-1 flex items-center justify-center gap-1 text-slate-400 text-sm">
                                        <Eye size={14} />
                                        {notice.views}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-20 text-slate-400">
                            <p>공지사항이 없습니다.</p>
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

export default Notice;
