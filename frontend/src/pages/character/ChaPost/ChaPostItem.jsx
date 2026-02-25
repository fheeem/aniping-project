import { Link } from 'react-router-dom';
import { Eye, Heart, Megaphone } from 'lucide-react';

const ChaPostItem = ({ post, index }) => {
  const { id, title, userName, createAt, views, likes, boardType } = post;

  const isNotification = boardType === 'NOTIFICATION';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\.$/, '');
  };

  return (
    <li className={`grid grid-cols-12 gap-4 p-5 items-center transition-colors group text-center ${isNotification ? 'bg-blue-50 font-bold' : 'hover:bg-slate-50/50'}`}>
        <div className="col-span-1 text-slate-500 text-sm font-medium">
            {isNotification ? (
                <Megaphone className="mx-auto text-blue-500" size={20} />
            ) : (
                index
            )}
        </div>
        <div className="col-span-5 text-left pl-4">
            <Link to={`/chaPostDetail/${id}`} className={`text-base group-hover:text-primary transition-colors line-clamp-1 ${isNotification ? 'text-blue-700' : 'text-slate-700 font-bold'}`}>
                {title}
            </Link>
        </div>
        <div className="col-span-2 font-medium text-slate-600">
            {userName}
        </div>
        <div className="col-span-2 text-sm text-slate-400">
            {formatDate(createAt)}
        </div>
        <div className="col-span-1 flex items-center justify-center gap-1 text-slate-400 text-sm">
            <Eye size={14} />
            {views}
        </div>
        <div className="col-span-1 flex items-center justify-center gap-1 text-slate-400 text-sm">
            <Heart size={14} />
            {likes}
        </div>
    </li>
  );
};
export default ChaPostItem;
