import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChaRankItem from './ChaRankItem';
import { Paging } from '../../../components/common/Paging';
import { Trophy, Search } from 'lucide-react';
import { useUser } from '../../../context/UserContext';

const ChaRankPage = () => {
  const { userType } = useUser();
  const [allCharacters, setAllCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isLoggedIn = userType === 'user' || userType === 'admin';

  const fetchCharacters = () => {
    axios.get('http://localhost:8080/api/characters/ranking')
        .then((res) => {
          setAllCharacters(res.data);
          setFilteredCharacters(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  useEffect(() => {
    let characters = [...allCharacters];
    if (searchTerm) {
      characters = characters.filter(char =>
          char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (char.aniname && char.aniname.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredCharacters(characters);
    setCurrentPage(1);
  }, [searchTerm, allCharacters]);

  const handleLike = async (characterId) => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/characters/${characterId}/like`);
      fetchCharacters();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      }
      console.error(err);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCharacters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);

  if (loading) return <div className="text-center p-10">로딩 중...</div>;

  return (
      <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-primary rounded-full"></div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  Character Ranking
                  <Trophy className="text-yellow-400 fill-yellow-400" size={24} />
                </h2>
              </div>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                  type="text"
                  placeholder="검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-blue-50/50 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-6 bg-slate-50/50 border-b border-blue-50 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
              <div className="col-span-1">Rank</div>
              <div className="col-span-2">Image</div>
              <div className="col-span-3 text-left pl-4">Character</div>
              <div className="col-span-4 text-left">Animation</div>
              <div className="col-span-2">Likes</div>
            </div>

            <div className="divide-y divide-blue-50">
              {currentItems.length > 0 ? (
                  currentItems.map((character, index) => (
                      <ChaRankItem
                          key={character.id}
                          character={{
                            ...character,
                            rank: indexOfFirstItem + index + 1,
                            likes: character.voteCount
                          }}
                          onLike={() => handleLike(character.id)}
                      />
                  ))
              ) : (
                  <div className="p-20 text-center text-slate-400">검색 결과가 없습니다.</div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <Paging page={currentPage} totalPage={totalPages} setPage={setCurrentPage} />
          </div>
        </div>
      </div>
  );
};

export default ChaRankPage;