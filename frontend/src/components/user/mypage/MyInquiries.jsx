import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, Search } from 'lucide-react';
import { Paging } from '../../../components/common/Paging';

const MyInquiries = () => {
  const [allInquiries, setAllInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openInquiry, setOpenInquiry] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    axios.get('/data/userInquiries.json')
      .then(res => {
        setAllInquiries(res.data);
        setFilteredInquiries(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load user inquiries", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let inquiries = [...allInquiries];
    if (searchTerm) {
      inquiries = inquiries.filter(inquiry => 
        inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inquiry.answer && inquiry.answer.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredInquiries(inquiries);
    setCurrentPage(1);
  }, [searchTerm, allInquiries]);

  const toggleInquiry = (id) => {
    setOpenInquiry(openInquiry === id ? null : id);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'ANSWERED':
        return <span className="px-2 py-1 text-xs font-bold text-green-800 bg-green-100 rounded-full">답변 완료</span>;
      case 'WAITING':
        return <span className="px-2 py-1 text-xs font-bold text-orange-800 bg-orange-100 rounded-full">답변 대기</span>;
      default:
        return <span className="px-2 py-1 text-xs font-bold text-slate-800 bg-slate-100 rounded-full">{status}</span>;
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);

  if (loading) {
    return <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50 text-center text-slate-500">로딩 중...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50">
      <h3 className="text-2xl font-black text-slate-800 mb-8">문의사항</h3>
      
      <div className="relative flex-1 mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="제목, 내용, 답변으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200"
        />
      </div>

      {filteredInquiries.length === 0 ? (
        <p className="text-slate-500 text-center py-10">작성한 문의가 없습니다.</p>
      ) : (
        <>
          <div className="space-y-2">
            {currentItems.map((inquiry) => (
              <div key={inquiry.id} className="border border-slate-100 rounded-lg">
                <button 
                  onClick={() => toggleInquiry(inquiry.id)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    {getStatusChip(inquiry.status)}
                    <span className="font-bold text-slate-800">{inquiry.title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                    <ChevronDown 
                      size={20} 
                      className={`text-slate-400 transition-transform duration-300 ${openInquiry === inquiry.id ? 'rotate-180' : ''}`} 
                    />
                  </div>
                </button>
                
                {openInquiry === inquiry.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 animate-fadeIn">
                    <div className="space-y-4">
                      <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-md">
                        <p className="font-bold mb-2 text-slate-700">[문의 내용]</p>
                        {inquiry.content}
                      </div>
                      {inquiry.answer && (
                        <div className="text-sm text-slate-800 leading-relaxed bg-blue-50 p-4 rounded-md">
                          <p className="font-bold mb-2 text-primary">[답변 내용]</p>
                          {inquiry.answer}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Paging page={currentPage} totalPage={totalPages} setPage={setCurrentPage} />
          </div>
        </>
      )}
    </div>
  );
};

export default MyInquiries;
