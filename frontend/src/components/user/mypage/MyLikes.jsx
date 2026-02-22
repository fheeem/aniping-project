import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Search, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyLikes = () => {
  const [wishlistPage, setWishlistPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);

  const fetchWishlist = (currentPage = 0, currentKeyword = '') => {
    setLoading(true);
    axios.get(`/api/user/wishlist?page=${currentPage}&size=9&keyword=${currentKeyword}`)
      .then(res => {
        setWishlistPage(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load wishlist", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWishlist(page, keyword);
    window.scrollTo(0, 0); // 페이지 변경 시 스크롤 최상단으로 이동
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // 검색 시 첫 페이지로
    fetchWishlist(0, keyword);
  };

  const handleRemoveWish = (aniId) => {
    if (window.confirm("찜 목록에서 삭제하시겠습니까?")) {
        axios.delete(`/api/user/wishlist/${aniId}`)
            .then(() => {
                alert("삭제되었습니다.");
                // 현재 페이지에서 해당 아이템 제거 또는 전체 목록 다시 불러오기
                setWishlistPage(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        content: prev.content.filter(item => item.aniId !== aniId),
                        totalElements: prev.totalElements - 1
                    };
                });
            })
            .catch(err => {
                alert(err.response?.data || "삭제 중 오류가 발생했습니다.");
            });
    }
  };

  const renderPagination = () => {
    if (!wishlistPage) return null;
    const { totalPages, number } = wishlistPage;
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

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-slate-100">
        <h3 className="text-2xl font-black text-slate-800 mb-4 md:mb-0">
          찜한 애니메이션 <span className="text-primary ml-2">{wishlistPage?.totalElements || 0}</span>
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
        <div className="text-center py-10 text-slate-500">찜 목록을 불러오는 중입니다...</div>
      ) : wishlistPage && wishlistPage.content && wishlistPage.content.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistPage.content.map((item) => (
              <div key={item.id} className="group relative bg-slate-50 rounded-xl overflow-hidden border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="aspect-video bg-slate-200 relative overflow-hidden">
                    {item.imgUrl ? (
                        <img 
                            src={item.imgUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                            <ImageIcon size={32} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-primary bg-blue-50 px-2 py-1 rounded-lg">
                      {item.grade === 'all' ? '전체관람가' : `${item.grade}세`}
                    </span>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>
                  
                  <h4 className="font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500 line-clamp-1">{item.studio}</p>
                  
                  <Link 
                    to={`/detail/${item.aniId}`} 
                    className="absolute inset-0 z-0"
                    aria-label={`${item.title} 상세 페이지로 이동`}
                  />
                  <button 
                    onClick={() => handleRemoveWish(item.aniId)}
                    className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    aria-label="찜 해제"
                  >
                    <Heart fill="currentColor" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      ) : (
        <div className="text-center py-20">
          <Heart className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 text-lg font-medium">찜한 애니메이션이 없습니다.</p>
          <Link to="/list/all" className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors">
            애니메이션 보러가기
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyLikes;
