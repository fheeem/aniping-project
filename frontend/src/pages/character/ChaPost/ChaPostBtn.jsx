import { Link } from 'react-router-dom';
import { Heart, Edit, Trash2 } from 'lucide-react';

const ChaPostBtn = ({ id, handleLikeClick, heartStyle, onDelete }) => {
  return (
    <div className="flex items-center justify-between mt-8">
      <button 
        onClick={handleLikeClick} 
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-pink-50 text-accent font-bold hover:bg-pink-100 transition-colors"
      >
        <Heart 
            size={20} 
            fill={heartStyle.fontVariationSettings === "'FILL' 1" ? "currentColor" : "none"} 
            className={heartStyle.color === 'red' ? 'text-red-500' : ''}
        />
        <span>Like</span>
      </button>

      <div className="flex items-center gap-3">
        <Link to={`/chaPostEdit/${id}`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm">
            <Edit size={16} />
            Edit
        </Link>
        <button onClick={onDelete} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-colors text-sm">
            <Trash2 size={16} />
            Delete
        </button>
      </div>
    </div>
  );
};
export default ChaPostBtn;
