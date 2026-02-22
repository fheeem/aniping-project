import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Trash2, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyLines = () => {
  const [linesPage, setLinesPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const fetchLines = (currentPage = 0) => {
    setLoading(true);
    axios.get(`/api/user/lines?page=${currentPage}&size=10`)
      .then(res => {
        setLinesPage(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load lines", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLines(page);
    window.scrollTo(0, 0);
  }, [page]);

  const handleDeleteLine = (lineId) => {
    if (window.confirm("명대사를 삭제하시겠습니까?")) {
        axios.delete(`/api/user/lines/${lineId}`)
            .then(() => {
                alert("명대사가 삭제되었습니다.");
                fetchLines(page);
            })
            .catch(err => {
                alert(err.response?.data || "삭제 중 오류가 발생했습니다.");
            });
    }
  };

  const renderPagination = () => {
    if (!linesPage) return null;
    const { totalPages, number } = linesPage;
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
          내가 쓴 명대사 <span className="text-primary ml-2">{linesPage?.totalElements || 0}</span>
        </h3>
      </div>
      
      {loading ? (
        <div className="text-center py-10 text-slate-500">명대사 목록을 불러오는 중입니다...</div>
      ) : linesPage && linesPage.content && linesPage.content.length > 0 ? (
        <>
          <div className="space-y-4">
            {linesPage.content.map((line) => (
              <div key={line.id} className="group bg-slate-50 p-5 rounded-xl border border-slate-100 hover:shadow-md transition-all hover:-translate-y-0.5 relative flex gap-4">
                {/* 명대사 이미지 */}
                <div className="w-24 h-24 flex-shrink-0 bg-slate-200 rounded-lg overflow-hidden">
                    {line.imgUrl ? (
                        <img 
                            src={line.imgUrl} 
                            alt="명대사 이미지" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon size={24} />
                        </div>
                    )}
                </div>

                <div className="flex-1 pr-12">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-800 font-medium text-lg line-clamp-2">
                            "{line.content}"
                        </p>
                    </div>
                    <div className="flex gap-4 text-sm text-slate-500 mt-2">
                        <span>좋아요 {line.likes}</span>
                        <span>{new Date(line.createAt).toLocaleDateString().replace(/\.$/, '')}</span>
                    </div>
                </div>
                
                <button 
                    onClick={() => handleDeleteLine(line.id)}
                    className="absolute top-1/2 -translate-y-1/2 right-4 z-10 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    aria-label="명대사 삭제"
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
          <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 text-lg font-medium">작성한 명대사가 없습니다.</p>
          <Link to="/chaLine" className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors">
            명대사 쓰러 가기
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyLines;
