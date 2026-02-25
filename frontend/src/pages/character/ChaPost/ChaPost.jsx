import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChaPostItem from './ChaPostItem';
import { PenSquare, MessageSquare, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUser } from "../../../context/UserContext.jsx";

const ChaPost = () => {
    const navigate = useNavigate();
    const { userInfo } = useUser();

    const [postsPage, setPostsPage] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0); // 0-based index for backend
    const [isLoading, setIsLoading] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(10); // 백엔드 기본값은 10이지만 변경 가능하도록

    const fetchPosts = async (currentPage, currentKeyword, size) => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:8080/api/board/list', {
                params: { 
                    page: currentPage, 
                    size: size,
                    keyword: currentKeyword 
                }
            });
            setPostsPage(response.data);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(page, keyword, itemsPerPage);
        window.scrollTo(0, 0);
    }, [page, itemsPerPage]); // keyword는 검색 버튼 누를 때만 반영

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchPosts(0, keyword, itemsPerPage);
    };

    const handleWriteClick = () => {
        if (!userInfo) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }
        navigate('/chaNewPost');
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < (postsPage?.totalPages || 1)) {
            setPage(newPage);
        }
    };

    if (isLoading && !postsPage) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-[1440px] mx-auto">

                {/* 상단 헤더 */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                Community
                                <MessageSquare className="text-primary" size={24} />
                            </h2>
                            <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">
                                Free Board
                            </p>
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

                {/* 검색 & 페이지 사이즈 */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <form onSubmit={handleSearch} className="relative w-full md:w-80 flex">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="제목으로 검색..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                        />
                    </form>

                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setPage(0); // 페이지 사이즈 변경 시 첫 페이지로 이동
                        }}
                        className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 focus:outline-none focus:border-primary cursor-pointer"
                    >
                        <option value={10}>10개씩 보기</option>
                        <option value={15}>15개씩 보기</option>
                        <option value={30}>30개씩 보기</option>
                    </select>
                </div>

                {/* 게시글 테이블 */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-blue-50/50 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-6 bg-slate-50/50 border-b border-blue-50 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
                        <div className="col-span-1">번호</div>
                        <div className="col-span-5 text-left pl-4">제목</div>
                        <div className="col-span-2">작성자</div>
                        <div className="col-span-2">작성일</div>
                        <div className="col-span-1">조회수</div>
                        <div className="col-span-1">추천</div>
                    </div>

                    {postsPage && postsPage.content && postsPage.content.length > 0 ? (
                        <ul className="divide-y divide-blue-50">
                            {(() => {
                                // 현재 페이지 내의 공지사항 개수 계산
                                const notificationCount = postsPage.content.filter(p => p.boardType === 'NOTIFICATION').length;
                                
                                return postsPage.content.map((post, index) => {
                                    const isNotification = post.boardType === 'NOTIFICATION';
                                    
                                    // 일반 게시글의 인덱스 계산 (공지사항 개수만큼 뺌)
                                    // index는 0부터 시작하므로, 공지사항이 2개라면 일반글 첫번째는 index 2임.
                                    // 2 - 2 = 0 (일반글 내에서의 순서)
                                    const generalPostIndex = index - notificationCount;
                                    
                                    // 표시할 번호 계산
                                    const displayIndex = postsPage.totalElements - (postsPage.number * postsPage.size) - generalPostIndex;

                                    return (
                                        <ChaPostItem
                                            key={post.id}
                                            post={post}
                                            index={isNotification ? 0 : displayIndex}
                                        />
                                    );
                                });
                            })()}
                        </ul>
                    ) : (
                        <div className="text-center py-20 text-slate-400">
                            <p>게시글이 없습니다.</p>
                        </div>
                    )}
                </div>

                {/* 페이지네이션 */}
                {postsPage && postsPage.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {Array.from({ length: postsPage.totalPages }, (_, i) => i).map(p => (
                            <button
                                key={p}
                                onClick={() => handlePageChange(p)}
                                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all
                                ${page === p
                                    ? 'bg-primary text-white shadow-md scale-105'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {p + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === postsPage.totalPages - 1}
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
