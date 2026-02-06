import { Heart, User, Clock } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const ChaLineItem = ({ line }) => {
  const [likes, setLikes] = useState(line.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      await axios.post(`http://localhost:8080/api/lines/${line.id}/like`);
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '방금 전';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
      <div className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden group flex flex-col cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="relative overflow-hidden">
          <img
              src={line.sceneImg || "/default-image.png"}
              alt={line.content}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h4 className="font-bold text-lg">{line.charId ? `캐릭터 #${line.charId}` : "알 수 없는 캐릭터"}</h4>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <p className="text-slate-700 font-semibold text-lg leading-relaxed flex-grow">"{line.content}"</p>

          <div className="text-xs text-slate-400 font-medium mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <User size={12} />
              <span>{line.userId ? `유저 ${line.userId}` : '익명'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              <span>{formatDate(line.createAt)}</span>
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
            <span>{likes}</span>
          </button>
        </div>
      </div>
  );
};

export default ChaLineItem;