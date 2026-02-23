import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, FileText, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyPosts = () => {
  const [postsPage, setPostsPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);

  const fetchPosts = (currentPage = 0, currentKeyword = '') => {
    setLoading(true);
    axios.get(`/api/user/posts?page=${currentPage}&size=10&keyword=${currentKeyword}`)
      .then(res => {
        setPostsPage(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load posts", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts(page, keyword);
    window.scrollTo(0, 0);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchPosts(0, keyword);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
        axios.delete(`/api/user/posts/${postId}`)
            .then(() => {
                alert("게시글이 삭제되었습니다.");
                fetchPosts(page, keyword);
            })
            .catch(err => {
                alert(err.response?.data || "삭제 중 오류가 발생했습니다.");
            });
    }
  };

  const renderPagination = () => {
    if (!postsPage) return null;
    const { totalPages, number } = postsPage;
    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        {pageNumbers.map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-10 h-10 rounded-full font-bold transition-colors ${
              p === number ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {p + 1}
          </button>
        ))}
      </div>
    );
  };

  // 날짜 포맷팅 함수 (마지막 점 제거)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // YYYY. MM. DD 형식으로 변환 후 마지막 점 제거
    return date.toLocaleDateString().replace(/\.$/, '');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-slate-100">
        <h3 className="text-2xl font-black text-slate-800 mb-4 md:mb-0">
          내가 쓴 글 <span className="text-primary ml-2">{postsPage?.totalElements || 0}</span>
        </h3>
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input 
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="제목으로 검색"
            className="w-full md:w-64 px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="p-2 bg-primary text-white rounded-xl">
            <Search size={20} />
          </button>
        </form>
      </div>
      
      {loading ? (
        <div className="text-center py-10 text-slate-500">글 목록을 불러오는 중입니다...</div>
      ) : postsPage && postsPage.content && postsPage.content.length > 0 ? (
        <>
          <div className="space-y-4">
            {postsPage.content.map((post) => (
              <div key={post.id} className="group bg-slate-50 p-5 rounded-xl border border-slate-100 hover:shadow-md transition-all hover:-translate-y-0.5 relative pr-14">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {post.title}
                  </h4>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                    {formatDate(post.createAt)}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-slate-500">
                  <span>조회 {post.views}</span>
                  <span>좋아요 {post.likes}</span>
                </div>
                
                <Link 
                  to={`/freeboard/${post.id}`} 
                  className="absolute inset-0 z-0"
                  aria-label={`${post.title} 게시글로 이동`}
                />
                
                <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="absolute top-1/2 -translate-y-1/2 right-4 z-10 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    aria-label="게시글 삭제"
                >
                    <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      ) : (
        <div className="text-center py-20">
          <FileText className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 text-lg font-medium">작성한 글이 없습니다.</p>
          <Link to="/freeboard" className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors">
            글 쓰러 가기
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
