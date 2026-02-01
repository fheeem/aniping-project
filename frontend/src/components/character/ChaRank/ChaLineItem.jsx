import { Heart, User, Clock } from "lucide-react";
import { useState } from "react";
import { timeAgo } from "../../../utils/time"; // 유틸리티 함수 import

const ChaLineItem = ({ line }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(line.likeCount || Math.floor(Math.random() * 100));

  const handleLike = () => {
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden group flex flex-col">
      <div className="relative overflow-hidden">
        <img src={line.image} alt={line.character} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h4 className="font-bold text-lg">{line.character}</h4>
          <p className="text-xs font-medium">{line.anime}</p>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-slate-700 font-semibold text-lg leading-relaxed flex-grow">"{line.line}"</p>
        
        <div className="text-xs text-slate-400 font-medium mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <User size={12} />
            <span>{line.author || '익명'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{timeAgo(line.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4 flex justify-end">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm font-bold transition-colors rounded-full px-4 py-2
            ${isLiked ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500'}`}
        >
          <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likeCount}</span>
        </button>
      </div>
    </div>
  );
};

export default ChaLineItem;
