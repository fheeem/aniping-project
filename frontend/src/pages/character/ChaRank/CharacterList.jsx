import { Film } from 'lucide-react';

const CharacterList = ({ works }) => {
  if (!works || works.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <Film size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold text-lg">출연 작품 정보가 없습니다.</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {works.map((work, idx) => (
        <div key={idx} className="group flex flex-col items-center text-center">
          <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-slate-100 mb-4 relative group-hover:-translate-y-1 transition-transform duration-300">
            <img 
              src={work.thumb_image || work.full_image || "/images/no-image.png"} 
              alt={work.character_name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {e.target.src = "/images/no-image.png"}}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <span className="text-white text-xs font-bold px-2">View Detail</span>
            </div>
          </div>
          
          <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {work.character_name}
          </h4>
          <p className="text-xs text-slate-500 font-medium line-clamp-1">
            {work.anime_title}
          </p>
        </div>
      ))}
    </div>
  );
};
export default CharacterList;
