import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Save } from 'lucide-react';

const ChaPostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/data/postItem.json');
        const data = response.data;
        const foundPost = data.find((item) => item.id.toString() === id);

        if (foundPost) {
          setPost(foundPost);
          setFormData({
            title: foundPost.title,
            content: foundPost.content,
          });
        } else {
          // alert('게시글을 찾을 수 없습니다.');
          // navigate('/chaPost');
          // Mock data fallback for demo
          setPost({ id, title: 'Mock Title', content: 'Mock Content' });
          setFormData({ title: 'Mock Title', content: 'Mock Content' });
        }
      } catch (e) {
        console.error('데이터 로딩 실패:', e);
         // Mock data fallback for demo
         setPost({ id, title: 'Mock Title', content: 'Mock Content' });
         setFormData({ title: 'Mock Title', content: 'Mock Content' });
      }
    };
    fetchData();
  }, [id, navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    console.log('수정된 게시글 데이터:', formData);
    alert('게시글이 성공적으로 수정되었습니다!');
    navigate(`/chaPostDetail/${id}`);
  };
  if (!post) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-500 hover:text-primary font-bold mb-8 transition-colors">
            <ChevronLeft size={20} />
            Back to Detail
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-blue-50/50 p-8 md:p-12">
            <h1 className="text-3xl font-black text-slate-800 mb-8">Edit Post</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-800 placeholder:text-slate-400"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="content" className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Content</label>
                    <textarea
                        name="content"
                        id="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={10}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700 placeholder:text-slate-400 resize-none"
                    />
                </div>
                
                <div className="flex items-center justify-end gap-4 pt-4">
                    <button
                        type="button"
                        className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};
export default ChaPostEdit;
