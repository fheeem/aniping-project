import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Paging } from '../../../components/common/Paging';
import { Search, Trash2 } from 'lucide-react';

const MyPosts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosts, setSelectedPosts] = useState(new Set());

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 고정

  useEffect(() => {
    axios.get('/data/userPosts.json')
      .then(res => {
        setAllPosts(res.data);
        setFilteredPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load user posts", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let posts = [...allPosts];
    if (searchTerm) {
      posts = posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredPosts(posts);
    setCurrentPage(1);
  }, [searchTerm, allPosts]);

  const handleSelect = (postId) => {
    const newSelection = new Set(selectedPosts);
    if (newSelection.has(postId)) {
      newSelection.delete(postId);
    } else {
      newSelection.add(postId);
    }
    setSelectedPosts(newSelection);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPosts(new Set(currentItems.map(post => post.id)));
    } else {
      setSelectedPosts(new Set());
    }
  };

  const handleDelete = () => {
    if (selectedPosts.size === 0) {
      alert("삭제할 게시글을 선택해주세요.");
      return;
    }
    if (window.confirm(`${selectedPosts.size}개의 게시글을 삭제하시겠습니까?`)) {
      const updatedPosts = allPosts.filter(post => !selectedPosts.has(post.id));
      setAllPosts(updatedPosts);
      setSelectedPosts(new Set());
      alert("삭제되었습니다.");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  if (loading) {
    return <div className="text-center p-10">로딩 중...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50">
      <h3 className="text-2xl font-black text-slate-800 mb-8">내가 쓴 글</h3>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
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
        <button 
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-bold text-sm rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 size={16} />
          <span>선택 삭제</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="p-4">
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll}
                  checked={selectedPosts.size > 0 && selectedPosts.size === currentItems.length}
                />
              </th>
              <th scope="col" className="px-6 py-3">제목</th>
              <th scope="col" className="px-6 py-3">게시판</th>
              <th scope="col" className="px-6 py-3">작성일</th>
              <th scope="col" className="px-6 py-3 text-center">조회/추천</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((post) => (
              <tr key={post.id} className="bg-white border-b hover:bg-slate-50">
                <td className="p-4">
                  <input 
                    type="checkbox" 
                    checked={selectedPosts.has(post.id)}
                    onChange={() => handleSelect(post.id)}
                  />
                </td>
                <th scope="row" className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                  <Link to={`/chaPostDetail/${post.id}`} className="hover:underline">{post.title}</Link>
                </th>
                <td className="px-6 py-4">{post.board}</td>
                <td className="px-6 py-4">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center">{post.views} / {post.likes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredPosts.length === 0 && (
        <p className="text-slate-500 text-center py-10">작성한 글이 없습니다.</p>
      )}
      <div className="mt-8">
        <Paging page={currentPage} totalPage={totalPages} setPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default MyPosts;
