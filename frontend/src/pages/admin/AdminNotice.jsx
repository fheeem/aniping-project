import { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Plus, Edit, Trash2, Save, X, Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const AdminNotice = () => {
    const [notices, setNotices] = useState([]);
    const [filteredNotices, setFilteredNotices] = useState([]);
    const [isEditing, setIsEditing] = useState(null); // 'new' or id
    const [editForm, setEditForm] = useState({ title: '', content: '' });
    const [openId, setOpenId] = useState(null); // 아코디언으로 열린 항목의 ID
    
    // Filter & Pagination States
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const loadData = async () => {
            const storedNotices = localStorage.getItem('admin_notices');
            if (storedNotices) {
                const data = JSON.parse(storedNotices);
                setNotices(data);
            } else {
                try {
                    const response = await axios.get('/data/noticeData.json');
                    setNotices(response.data);
                    localStorage.setItem('admin_notices', JSON.stringify(response.data));
                } catch (e) {
                    console.error(e);
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
    };

    // CRUD 핸들러
    const handleAddClick = () => {
        setIsEditing('new');
        setEditForm({ title: '', content: '' });
        setOpenId(null);
    };

    const handleEditClick = (e, notice) => {
        e.stopPropagation();
        setIsEditing(notice.id);
        setEditForm({ title: notice.title, content: notice.content });
        setOpenId(null);
    };

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        if (confirm('정말로 삭제하시겠습니까?')) {
            const newNotices = notices.filter(n => n.id !== id);
            setNotices(newNotices);
            localStorage.setItem('admin_notices', JSON.stringify(newNotices));
            if (openId === id) setOpenId(null);
        }
    };

    const handleSave = () => {
        if (!editForm.title.trim() || !editForm.content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        let newNotices = [...notices];
        const today = new Date().toISOString().slice(0, 10);

        if (isEditing === 'new') {
            const newId = notices.length > 0 ? Math.max(...notices.map(n => n.id)) + 1 : 1;
            newNotices.unshift({ id: newId, ...editForm, date: today, views: 0 });
            alert('공지사항이 등록되었습니다.');
        } else {
            newNotices = newNotices.map(n => 
                n.id === isEditing ? { ...n, ...editForm } : n
            );
            alert('수정되었습니다.');
        }

        setNotices(newNotices);
        localStorage.setItem('admin_notices', JSON.stringify(newNotices));
        setIsEditing(null);
        setEditForm({ title: '', content: '' });
    };

    const handleCancel = () => {
        setIsEditing(null);
        setEditForm({ title: '', content: '' });
    };

    const toggleAccordion = (id) => {
        if (isEditing) return;
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                Notice Management
                                <Megaphone className="text-primary" size={28} />
                            </h2>
                            <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">공지사항 관리</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <button onClick={handleAddClick} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            <Plus size={18} />
                            <span>공지사항 등록</span>
                        </button>
                    )}
                </div>

                {/* 입력 폼 */}
                {isEditing && (
                    <div className="bg-white p-8 rounded-2xl shadow-md border border-blue-100 mb-8 animate-fadeIn">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">{isEditing === 'new' ? '새 공지사항 작성' : '공지사항 수정'}</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-2">제목</label>
                                <input 
                                    type="text" 
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary font-bold text-slate-700"
                                    placeholder="제목을 입력하세요"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-2">내용</label>
                                <textarea 
                                    value={editForm.content}
                                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                    rows={10}
                                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary text-slate-600 resize-none"
                                    placeholder="내용을 입력하세요"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button onClick={handleCancel} className="px-6 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 font-bold transition-colors">취소</button>
                                <button onClick={handleSave} className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 shadow-sm transition-all">
                                    <Save size={18} /> 저장
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-5 bg-slate-100/80 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
                        <div className="col-span-1">No</div>
                        <div className="col-span-7 text-left pl-4">Title</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2">Actions</div>
                    </div>

                    <ul className="divide-y divide-slate-100">
                        {currentItems.map((notice, index) => (
                            <li key={notice.id} className="flex flex-col">
                                <div 
                                    onClick={() => toggleAccordion(notice.id)}
                                    className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-50/50 transition-colors cursor-pointer text-center"
                                >
                                    <div className="col-span-1 text-slate-500 font-medium">
                                        {filteredNotices.length - (indexOfFirstItem + index)}
                                    </div>
                                    <div className="col-span-7 text-left pl-4 font-bold text-slate-700 truncate">
                                        {notice.title}
                                    </div>
                                    <div className="col-span-2 text-sm text-slate-400">
                                        {notice.date}
                                    </div>
                                    <div className="col-span-2 flex items-center justify-center gap-2">
                                        <button 
                                            onClick={(e) => handleEditClick(e, notice)}
                                            className="p-2 text-slate-400 hover:bg-blue-100 hover:text-blue-600 rounded-full transition-colors"
                                            title="수정"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDeleteClick(e, notice.id)}
                                            className="p-2 text-slate-400 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors"
                                            title="삭제"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <ChevronDown className={`text-slate-400 transition-transform duration-300 ${openId === notice.id ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openId === notice.id ? 'max-h-96' : 'max-h-0'}`}>
                                    <div className="px-10 pb-6 pt-2">
                                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-lg border border-slate-200">
                                            {notice.content}
                                        </p>
                                    </div>
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

export default AdminNotice;
