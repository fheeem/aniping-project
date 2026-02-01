import { Link } from "react-router-dom";
import { Heart, Trophy } from "lucide-react";

const ChaCvListItem = ({ cv }) => {
  const { rank, name, image, aniImage, likes = 0, id } = cv;

  let rankColor = "text-slate-500";
  let rankIcon = null;

  if (rank === 1) {
    rankColor = "text-yellow-500";
    rankIcon = <Trophy size={16} className="fill-yellow-500 text-yellow-500" />;
  } else if (rank === 2) {
    rankColor = "text-slate-400";
    rankIcon = <Trophy size={16} className="fill-slate-400 text-slate-400" />;
  } else if (rank === 3) {
    rankColor = "text-amber-700";
    rankIcon = <Trophy size={16} className="fill-amber-700 text-amber-700" />;
  }

  return (
    <li className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-blue-50/30 transition-colors group">
      <div className={`col-span-1 flex flex-col items-center justify-center font-black text-xl ${rankColor}`}>
        {rank}
        {rankIcon}
      </div>
      
      <div className="col-span-3">
        <Link to={`/ChaCvDetail/${id}`} className="flex items-center gap-4 group/profile">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md group-hover/profile:scale-110 transition-transform shrink-0">
                <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-lg group-hover/profile:text-primary transition-colors">{name}</h3>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 mt-1">
                    <Heart size={12} className="fill-slate-300 text-slate-300 group-hover/profile:fill-accent group-hover/profile:text-accent transition-colors" />
                    {likes} Likes
                </div>
            </div>
        </Link>
      </div>

      <div className="col-span-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {aniImage.map((src, idx) => (
          <div key={idx} className="w-12 h-16 rounded-lg overflow-hidden border border-slate-100 shadow-sm shrink-0 hover:-translate-y-1 transition-transform">
            <img src={src} alt="참여작품" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </li>
  );
};

export default ChaCvListItem;
