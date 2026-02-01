import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ChaRankItem from './ChaRankItem';
import { Paging } from '../../../components/common/Paging';
import { Trophy, Plus, Search } from 'lucide-react';

const ChaRankPage = () => {
  const [allCharacters, setAllCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // 두 개의 JSON 파일을 동시에 불러옵니다.
    Promise.all([
      axios.get('/data/animeChaData.json'),
      axios.get('/data/animeData.json')
    ])
      .then(([chaRes, aniRes]) => {
        const animeMap = {};
        aniRes.data.forEach(ani => {
          animeMap[ani.id] = ani.title;
        });

        const flattenedCharacters = chaRes.data.flatMap(anime => 
          anime.characters.map((char, index) => {
            // 고유 ID 생성 (문자열)
            const uniqueId = `${anime.animeId}-${char.nameKr}`;
            
            // ID를 기반으로 시드 생성 (문자열의 각 문자 코드를 더함)
            let seed = 0;
            for (let i = 0; i < uniqueId.length; i++) {
              seed += uniqueId.charCodeAt(i);
            }
            
            // 시드를 기반으로 고정된 좋아요 수 생성 (100 ~ 5000)
            // 간단한 선형 합동 생성기(LCG)와 유사한 방식 사용
            const likes = (seed * 9301 + 49297) % 4900 + 100;

            return {
              id: uniqueId,
              name: char.nameKr,
              image: char.image,
              aniname: animeMap[anime.animeId] || "알 수 없음",
              likes: likes,
            };
          })
        );
        setAllCharacters(flattenedCharacters);
        setFilteredCharacters(flattenedCharacters);
        setLoading(false);
      })
      .catch(err => {
        console.error("데이터 로딩 실패:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let characters = [...allCharacters];

    if (searchTerm) {
      characters = characters.filter(char => 
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.aniname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCharacters(characters);
    setCurrentPage(1);
  }, [searchTerm, allCharacters]);

  const sortedCharacters = [...filteredCharacters].sort((a, b) => b.likes - a.likes);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCharacters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedCharacters.length / itemsPerPage);

  if (loading) {
    return <div className="text-center p-10">로딩 중...</div>;
  }

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
              <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">Weekly Best Characters</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="캐릭터 또는 작품명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200"
              />
            </div>
            <Link 
              to="/chaRankPage/add"
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <Plus size={18} />
              <span>캐릭터 추가</span>
            </Link>
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

          <ul className="divide-y divide-blue-50">
            {currentItems.map((character, index) => (
              <ChaRankItem key={character.id} character={{...character, rank: indexOfFirstItem + index + 1}} />
            ))}
          </ul>
        </div>
        <div className="mt-12">
          <Paging page={currentPage} totalPage={totalPages} setPage={setCurrentPage} />
        </div>
      </div>
    </div>
  );
};
export default ChaRankPage;
