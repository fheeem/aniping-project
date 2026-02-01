import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Paging } from '../../../components/common/Paging';
import { Search, Edit, Trash2 } from 'lucide-react';

const MyLines = () => {
  const navigate = useNavigate();
  const [allLines, setAllLines] = useState([]);
  const [filteredLines, setFilteredLines] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const currentUsername = "테스트유저1"; // 로그인한 유저라고 가정

  useEffect(() => {
    axios.get('/data/adminChaLine.json')
      .then(res => {
        const userLines = res.data.filter(line => line.author === currentUsername);
        setAllLines(userLines);
        setFilteredLines(userLines);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load famous lines data", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let lines = [...allLines];
    if (searchTerm) {
      lines = lines.filter(line => 
        line.line.toLowerCase().includes(searchTerm.toLowerCase()) ||
        line.character.toLowerCase().includes(searchTerm.toLowerCase()) ||
        line.anime.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredLines(lines);
    setCurrentPage(1);
  }, [searchTerm, allLines]);

  const handleDelete = (lineId) => {
    if (window.confirm("이 명대사를 삭제하시겠습니까?")) {
      const updatedLines = allLines.filter(line => line.id !== lineId);
      setAllLines(updatedLines);
      alert("삭제되었습니다.");
    }
  };

  const handleEdit = (lineId) => {
    navigate(`/chaLine/edit/${lineId}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLines.length / itemsPerPage);

  if (loading) {
    return <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50 text-center text-slate-500">로딩 중...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50">
      <h3 className="text-2xl font-black text-slate-800 mb-8">내가 쓴 대사</h3>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="명대사, 캐릭터, 작품명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200"
          />
        </div>
      </div>

      {filteredLines.length === 0 ? (
        <p className="text-slate-500 text-center py-10">작성한 명대사가 없습니다.</p>
      ) : (
        <>
          <div className="space-y-4">
            {currentItems.map((line) => (
              <div key={line.id} className="p-4 border border-slate-100 rounded-lg flex items-start gap-4 hover:bg-slate-50 transition-colors">
                <img src={line.image} alt={line.character} className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-700">"{line.line}"</p>
                  <p className="text-xs text-slate-500 mt-1">- {line.character} from 「{line.anime}」</p>
                </div>
                <div className="flex flex-col items-end gap-2 text-xs text-slate-400">
                  <span>{new Date(line.createdAt).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(line.id)} className="text-slate-400 hover:text-blue-600"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(line.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </div>
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

export default MyLines;
