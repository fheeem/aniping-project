import { Heart, User, Clock } from "lucide-react";
import { useState } from "react";

const ChaLineItem = ({ line }) => {
  // line.likeCount가 없을 경우를 대비해 기본값 0 설정
  const [likeCount, setLikeCount] = useState(line.likeCount || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation(); // 카드 전체 클릭 이벤트 방지
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden group flex flex-col cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative overflow-hidden">
        <img src={line.image} alt={line.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h4 className="font-bold text-lg">{line.title}</h4>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-slate-700 font-semibold text-lg leading-relaxed flex-grow">"{line.content}"</p>
        
        <div className="text-xs text-slate-400 font-medium mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <User size={12} />
            <span>{line.user || '익명'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{line.date}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4 flex justify-end">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm font-bold transition-colors rounded-full px-4 py-2
            ${isLiked ? 'bg-pink-50 text-pink-500' : 'bg-slate-100 text-slate-500 hover:bg-pink-50 hover:text-pink-500'}`}
        >
          <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likeCount}</span>
        </button>
      </div>
    </div>
  );
};

export default ChaLineItem;
