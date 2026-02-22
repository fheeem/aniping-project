import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MessageCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom'; // Link 컴포넌트 import 확인

const MyInquiries = () => {
  const [inquiriesPage, setInquiriesPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'waiting', 'completed'
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  const fetchInquiries = (currentPage = 0, currentKeyword = '', currentStatus = 'all') => {
    setLoading(true);
    let url = `/api/user/inquiries?page=${currentPage}&size=10&keyword=${currentKeyword}`;
    if (currentStatus === 'waiting') {
        url += '&status=false';
    } else if (currentStatus === 'completed') {
        url += '&status=true';
    }

    axios.get(url)
      .then(res => {
        setInquiriesPage(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load inquiries", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInquiries(page, keyword, statusFilter);
    window.scrollTo(0, 0);
  }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchInquiries(0, keyword, statusFilter);
  };

  const handleDeleteInquiry = (inquiryId, e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    if (window.confirm("문의사항을 삭제하시겠습니까?")) {
        axios.delete(`/api/user/inquiries/${inquiryId}`)
            .then(() => {
                alert("문의사항이 삭제되었습니다.");
                fetchInquiries(page, keyword, statusFilter);
            })
            .catch(err => {
                alert(err.response?.data || "삭제 중 오류가 발생했습니다.");
            });
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderPagination = () => {
    if (!inquiriesPage) return null;
    const { totalPages, number } = inquiriesPage;
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-slate-100 gap-4">
        <h3 className="text-2xl font-black text-slate-800">
          1:1 문의 내역 <span className="text-primary ml-2">{inquiriesPage?.totalElements || 0}</span>
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* 필터링 버튼 그룹 */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                    onClick={() => { setStatusFilter('all'); setPage(0); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    전체
                </button>
                <button 
                    onClick={() => { setStatusFilter('waiting'); setPage(0); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === 'waiting' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    답변대기
                </button>
                <button 
                    onClick={() => { setStatusFilter('completed'); setPage(0); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === 'completed' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    답변완료
                </button>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <input 
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="제목/내용 검색"
                className="w-full sm:w-48 px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="p-2 bg-primary text-white rounded-xl">
                <Search size={20} />
            </button>
            </form>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-10 text-slate-500">문의 내역을 불러오는 중입니다...</div>
      ) : inquiriesPage && inquiriesPage.content && inquiriesPage.content.length > 0 ? (
        <>
          <div className="space-y-4">
            {inquiriesPage.content.map((inquiry) => (
              <div key={inquiry.id} className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden transition-all">
                {/* 헤더 (클릭 시 확장) */}
                <div 
                    onClick={() => toggleExpand(inquiry.id)}
                    className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
                >
                    <div className="flex-1 pr-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${inquiry.status ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                {inquiry.status ? '답변완료' : '답변대기'}
                            </span>
                            <span className="text-xs text-slate-400">
                                {new Date(inquiry.createAt).toLocaleDateString().replace(/\.$/, '')}
                            </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg line-clamp-1">
                            {inquiry.title}
                        </h4>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={(e) => handleDeleteInquiry(inquiry.id, e)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                            aria-label="문의 삭제"
                        >
                            <Trash2 size={18} />
                        </button>
                        {expandedId === inquiry.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                    </div>
                </div>

                {/* 확장 영역 (내용 및 답변) */}
                {expandedId === inquiry.id && (
                    <div className="px-5 pb-5 border-t border-slate-200 bg-white">
                        <div className="py-4">
                            <p className="text-slate-600 whitespace-pre-wrap">{inquiry.content}</p>
                        </div>
                        
                        {inquiry.status && (
                            <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageCircle size={16} className="text-primary" />
                                    <span className="font-bold text-primary">관리자 답변</span>
                                    <span className="text-xs text-slate-400 ml-auto">
                                        {inquiry.replyAt && new Date(inquiry.replyAt).toLocaleDateString().replace(/\.$/, '')}
                                    </span>
                                </div>
                                <h5 className="font-bold text-slate-800 mb-2">{inquiry.ansTitle}</h5>
                                <p className="text-slate-600 whitespace-pre-wrap text-sm">{inquiry.ansContent}</p>
                            </div>
                        )}
                    </div>
                )}
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      ) : (
        <div className="text-center py-20">
          <MessageCircle className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 text-lg font-medium">작성한 문의 내역이 없습니다.</p>
          <Link to="/AdCuSeAsk" className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors">
            문의하러 가기
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyInquiries;
