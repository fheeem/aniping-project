import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChaPostItem from './ChaPostItem';
import { PenSquare, MessageSquare, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ChaPost = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:8080/api/board', {
                params: { page: 0, size: 100 },
                withCredentials: true
            });
            const data = response.data.content || response.data;
            setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        let result = posts;
        if (searchTerm) {
            result = result.filter(post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredPosts(result);
        setCurrentPage(1);
    }, [posts, searchTerm]);

    const handleWriteClick = async () => {
        try {
            await axios.get('http://localhost:8080/api/user/me', { withCredentials: true });
            navigate('/chaNewPost');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('로그인이 필요한 서비스입니다.');
            } else {
                navigate('/chaNewPost');
            }
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                Community
                                <MessageSquare className="text-primary" size={24} />
                            </h2>
                            <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">Free Board</p>
                        </div>
                    </div>
                    <button
                        onClick={handleWriteClick}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        <PenSquare size={18} />
                        <span>새 글 작성</span>
                    </button>
                </div>

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
                        <option value={30}>30개씩 보기</option>
                    </select>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-blue-50/50 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-6 bg-slate-50/50 border-b border-blue-50 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
                        <div className="col-span-1">번호</div>
                        <div className="col-span-5 text-left pl-4">제목</div>
                        <div className="col-span-2">작성자</div>
                        <div className="col-span-2">작성일</div>
                        <div className="col-span-1">조회수</div>
                        <div className="col-span-1">추천</div>
                    </div>

                    {currentItems.length > 0 ? (
                        <ul className="divide-y divide-blue-50">
                            {currentItems.map((post, index) => (
                                <ChaPostItem
                                    key={post.id}
                                    post={post}
                                    index={filteredPosts.length - (indexOfFirstItem + index)}
                                />
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-20 text-slate-400">
                            <p>게시글이 없습니다.</p>
                        </div>
                    )}
                </div>

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

export default ChaPost;