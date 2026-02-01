import { User, Calendar, Eye, Heart } from 'lucide-react';

const ChaPdItem = ({ post }) => {
  const { title, date, writer, views, like, content } = post;
  return (
    <div className="ChaPdItem">
      <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 leading-tight">{title}</h1>
      
      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 mb-8 pb-8 border-b border-slate-100">
        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <User size={14} />
            {writer}
        </div>
        <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            {date}
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-1.5">
            <Eye size={14} />
            {views}
        </div>
        <div className="flex items-center gap-1.5 text-accent">
            <Heart size={14} fill="currentColor" />
            {like}
        </div>
      </div>

      <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed min-h-[200px]">
        {content}
      </div>
    </div>
  );
};
export default ChaPdItem;
