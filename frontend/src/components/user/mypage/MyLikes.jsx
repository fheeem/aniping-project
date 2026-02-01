import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Heart, Star, Search, Filter } from 'lucide-react';
import { Paging } from '../../../components/common/Paging';

const MyLikes = () => {
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    axios.get('/data/userLikes.json')
      .then(res => {
        setAllItems(res.data);
        setFilteredItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load liked items data", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let items = [...allItems];

    // 1. Search Filter
    if (searchTerm) {
      items = items.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(items);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, selectedCategory, allItems]);

  const handleUnlike = (itemId) => {
    if (window.confirm("찜 목록에서 삭제하시겠습니까?")) {
      const updatedItems = allItems.filter(item => item.id !== itemId);
      setAllItems(updatedItems);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const categories = ['all', 'fantasy', 'romance', 'mystery', 'sf', 'normal'];

  if (loading) {
    return <div className="text-center p-10">로딩 중...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50">
      <h3 className="text-2xl font-black text-slate-800 mb-8">찜 목록</h3>
      
      {/* Filter & Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-slate-50 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="제목으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-2 rounded-lg border border-slate-200 bg-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? '전체 카테고리' : cat}</option>
            ))}
          </select>
          <select 
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="w-full md:w-auto px-4 py-2 rounded-lg border border-slate-200 bg-white"
          >
            <option value={5}>5개씩 보기</option>
            <option value={10}>10개씩 보기</option>
            <option value={30}>30개씩 보기</option>
          </select>
        </div>
      </div>

      {currentItems.length === 0 ? (
        <p className="text-slate-500 text-center py-10">찜한 애니메이션이 없습니다.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {currentItems.map((item) => (
              <div key={item.id} className="relative group">
                <Link to={`/detail/${item.id}`}>
                  <div className="aspect-[3/4.2] rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h4 className="font-bold text-sm mt-3 truncate">{item.title}</h4>
                </Link>
                <button 
                  onClick={() => handleUnlike(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                  aria-label="찜 해제"
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Paging page={currentPage} totalPage={totalPages} setPage={setCurrentPage} />
          </div>
        </>
      )}
    </div>
  );
};

export default MyLikes;
