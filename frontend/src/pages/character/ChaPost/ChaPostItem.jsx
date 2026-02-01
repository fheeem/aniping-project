import { Link } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';

const ChaPostItem = ({ post, index }) => { // index prop 추가
  const { title, date, writer, views, like } = post;
  return (
    <li className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-50/50 transition-colors group text-center">
        <div className="col-span-1 text-slate-500 text-sm font-medium">{index}</div>
        <div className="col-span-5 text-left pl-4">
            <Link to={`/chaPostDetail/${post.id}`} className="font-bold text-slate-700 text-base group-hover:text-primary transition-colors line-clamp-1">
                {title}
            </Link>
        </div>
        <div className="col-span-2 font-medium text-slate-600">
            {writer}
        </div>
        <div className="col-span-2 text-sm text-slate-400">
            {date}
        </div>
        <div className="col-span-1 flex items-center justify-center gap-1 text-slate-400 text-sm">
            <Eye size={14} />
            {views}
        </div>
        <div className="col-span-1 flex items-center justify-center gap-1 text-slate-400 text-sm">
            <Heart size={14} />
            {like}
        </div>
    </li>
  );
};
export default ChaPostItem;
