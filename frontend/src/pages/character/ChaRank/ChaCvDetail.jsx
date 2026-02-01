import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Calendar, User, Activity, Building2, Globe, Twitter, Film, Image as ImageIcon } from "lucide-react";
import CharacterList from "./CharacterList";

const ChaCvDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cvData, setCvData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetch("/data/onnadaCvList.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((item) => item.id.toString() === id);
        if (found) {
          const seed = parseInt(found.id.toString().replace(/\D/g, '')) || 0;
          const initialLikes = (seed * 9301 + 49297) % 4900 + 100;
          
          setCvData(found);
          setLikesCount(initialLikes);
        }
      })
      .catch((err) => console.error("데이터 로딩 실패:", err));
  }, [id]);

  if (!cvData) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-lg font-bold text-slate-400">Loading...</div>
        </div>
    );
  }

  const toggleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleGoBack = () => {
    navigate(-1);
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <button onClick={handleGoBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors">
                <ArrowLeft size={20} />
                <span>뒤로가기</span>
            </button>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight hidden md:block">성우 프로필</h2>
            <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-blue-50 sticky top-24">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
                            <img 
                                src={cvData.image?.full || cvData.image?.thumb || "/images/no-image.png"} 
                                alt={cvData.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {e.target.src = "/images/no-image.png"}}
                            />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">{cvData.name}</h3>
                        
                        <button 
                            onClick={toggleLike}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all mt-4 shadow-sm
                                ${isLiked 
                                    ? 'bg-pink-50 text-pink-500 border border-pink-100' 
                                    : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'}`}
                        >
                            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                            <span>{likesCount.toLocaleString()} Likes</span>
                        </button>
                    </div>

                    <div className="space-y-4 text-sm">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="flex items-center gap-2 font-bold text-slate-500">
                                <Calendar size={16} /> 생년월일
                            </span>
                            <span className={`font-bold ${cvData.info?.생년월일 ? 'text-slate-700' : 'text-slate-400'}`}>
                                {cvData.info?.생년월일 || "정보 없음"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="flex items-center gap-2 font-bold text-slate-500">
                                <User size={16} /> 신장
                            </span>
                            <span className={`font-bold ${cvData.info?.신장 ? 'text-slate-700' : 'text-slate-400'}`}>
                                {cvData.info?.신장 || "정보 없음"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="flex items-center gap-2 font-bold text-slate-500">
                                <Activity size={16} /> 혈액형
                            </span>
                            <span className={`font-bold ${cvData.info?.혈액형 ? 'text-slate-700' : 'text-slate-400'}`}>
                                {cvData.info?.혈액형 || "정보 없음"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="flex items-center gap-2 font-bold text-slate-500">
                                <Building2 size={16} /> 소속사
                            </span>
                            <span className={`font-bold ${cvData.info?.소속사 ? 'text-slate-700' : 'text-slate-400'}`}>
                                {cvData.info?.소속사 || "정보 없음"}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-slate-100">
                        {cvData.info?.트위터 ? (
                            <a href={cvData.info.트위터} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-50 text-sky-500 font-bold hover:bg-sky-100 transition-colors">
                                <Twitter size={18} /> Twitter
                            </a>
                        ) : (
                            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 text-slate-400 font-bold cursor-not-allowed">
                                <Twitter size={18} /> Twitter 정보 없음
                            </div>
                        )}
                        
                        {cvData.info?.홈페이지 ? (
                            <a href={cvData.info.홈페이지} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors">
                                <Globe size={18} /> Website
                            </a>
                        ) : (
                            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 text-slate-400 font-bold cursor-not-allowed">
                                <Globe size={18} /> Website 정보 없음
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 1. 출연 작품 섹션 */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-blue-50">
                    <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2">
                        <Film className="text-primary" />
                        출연 작품
                        <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg ml-2">
                            {cvData.works?.length || 0}
                        </span>
                    </h3>
                    
                    {cvData.works && cvData.works.length > 0 ? (
                        <CharacterList works={cvData.works} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <Film size={48} className="text-slate-300 mb-4" />
                            <p className="text-slate-500 font-bold">출연 작품 정보가 없습니다.</p>
                        </div>
                    )}
                </div>

                {/* 2. 최근 참여 작품 (이미지) 섹션 */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-blue-50">
                    <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2">
                        <ImageIcon className="text-primary" />
                        최근 참여 작품 (이미지)
                    </h3>

                    {cvData.works && cvData.works.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                            {cvData.works.slice(0, 10).map((work, idx) => (
                                <div key={idx} className="w-24 h-32 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer border border-slate-100">
                                    <img 
                                        src={work.thumb_image || work.full_image || "/images/no-image.png"} 
                                        alt={work.character_name} 
                                        className="w-full h-full object-cover"
                                        title={`${work.character_name} (${work.anime_title})`}
                                        onError={(e) => {e.target.src = "/images/no-image.png"}}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <ImageIcon size={48} className="text-slate-300 mb-4" />
                            <p className="text-slate-500 font-bold">최근 참여 작품 이미지가 없습니다.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default ChaCvDetail;
