import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Eye, Heart, User, Calendar, Megaphone } from 'lucide-react';
import { useUser } from "../../../context/UserContext.jsx";

const ChaPostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useUser();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:8080/api/board/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error("Failed to fetch post:", error);
                alert("게시글을 불러오는데 실패했습니다.");
                navigate('/chaPost');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/user/posts/${id}`, { withCredentials: true });
            alert("게시글이 삭제되었습니다.");
            navigate('/chaPost');
        } catch (error) {
            console.error("Failed to delete post:", error);
            alert("게시글 삭제 중 오류가 발생했습니다.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-slate-500 font-medium">Loading...</div>
            </div>
        );
    }

    if (!post) return null;

    const isAuthor = userInfo && userInfo.nickname === post.userName; // 닉네임으로 본인 확인 (ID로 하는게 더 정확하지만 DTO에 ID가 없다면 닉네임 사용)
    const isNotification = post.boardType === 'NOTIFICATION';

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                {/* 상단 네비게이션 */}
                <button 
                    onClick={() => navigate('/chaPost')}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors font-medium"
                >
                    <ArrowLeft size={20} />
                    목록으로 돌아가기
                </button>

                {/* 게시글 본문 */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-blue-50 overflow-hidden">
                    {/* 헤더 */}
                    <div className={`p-8 md:p-10 border-b border-slate-100 ${isNotification ? 'bg-blue-50/50' : ''}`}>
                        <div className="flex items-center gap-3 mb-4">
                            {isNotification && (
                                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Megaphone size={12} />
                                    공지사항
                                </span>
                            )}
                            <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(post.createAt)}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-700 text-sm">{post.userName}</p>
                                    <p className="text-xs text-slate-400">작성자</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                                    <Eye size={16} />
                                    <span>{post.views}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                                    <Heart size={16} className="text-red-400" />
                                    <span>{post.likes}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 내용 */}
                    <div className="p-8 md:p-10 min-h-[300px]">
                        <div className="prose max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>

                    {/* 하단 버튼 (수정/삭제) */}
                    {isAuthor && (
                        <div className="px-8 md:px-10 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            {/* 수정 기능은 추후 구현 */}
                            {/* <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                                수정
                            </button> */}
                            <button 
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-colors"
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChaPostDetail;
