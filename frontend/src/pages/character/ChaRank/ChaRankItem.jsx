import React, { useState } from 'react';
import { Trophy, Heart } from 'lucide-react';

const ChaRankItem = ({ character }) => {
  const { image, rank, name, aniname, likes } = character;
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  
  let rankColor = "text-slate-500";
  let rankIcon = null;

  if (rank === 1) { // rank는 이제 숫자
    rankColor = "text-yellow-500";
    rankIcon = <Trophy size={16} className="fill-yellow-500 text-yellow-500" />;
  } else if (rank === 2) {
    rankColor = "text-slate-400";
    rankIcon = <Trophy size={16} className="fill-slate-400 text-slate-400" />;
  } else if (rank === 3) {
    rankColor = "text-amber-700";
    rankIcon = <Trophy size={16} className="fill-amber-700 text-amber-700" />;
  }

  const handleLike = () => {
    setIsLiked(prev => !prev);
    setCurrentLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

 return (
    <li className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-blue-50/30 transition-colors group">
      <div className={`col-span-1 flex flex-col items-center justify-center font-black text-xl ${rankColor}`}>
        {rank}
        {rankIcon}
      </div>
      <div className="col-span-2 flex justify-center">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:scale-110 transition-transform">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="col-span-3 text-left pl-4 font-bold text-slate-700 text-lg group-hover:text-primary transition-colors">
        {name}
      </div>
      <div className="col-span-4 text-left font-medium text-slate-500">
        {aniname}
      </div>
      <div className="col-span-2 flex items-center justify-center gap-2">
        <button onClick={handleLike} className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-red-500 transition-colors">
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'text-red-500' : 'text-slate-400'} />
          <span>{currentLikes}</span>
        </button>
      </div>
    </li>
  );
};
export default ChaRankItem;
