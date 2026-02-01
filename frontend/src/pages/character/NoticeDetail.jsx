import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Megaphone, Calendar, Eye, ArrowLeft } from 'lucide-react';

const NoticeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const storedNotices = localStorage.getItem('admin_notices');
            let notices = [];
            
            if (storedNotices) {
                notices = JSON.parse(storedNotices);
            } else {
                try {
                    const response = await axios.get('/data/noticeData.json');
                    notices = response.data;
                    localStorage.setItem('admin_notices', JSON.stringify(notices));
                } catch (e) {
                    console.error("데이터 로드 실패:", e);
                }
            }

            const foundNotice = notices.find(n => n.id === Number(id));
            if (foundNotice) {
                setNotice(foundNotice);
                // 조회수 증가 (임시)
                const updatedNotices = notices.map(n => 
                    n.id === Number(id) ? { ...n, views: (n.views || 0) + 1 } : n
                );
                localStorage.setItem('admin_notices', JSON.stringify(updatedNotices));
            }
        };
        loadData();
    }, [id]);

    if (!notice) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg font-bold text-slate-400">공지사항을 찾을 수 없습니다.</div>
            </div>
        );
    }

    const handleGoBack = () => {
        navigate('/notice');
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                <button onClick={handleGoBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors mb-8">
                    <ArrowLeft size={20} />
                    <span>목록으로</span>
                </button>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-blue-50/50">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 leading-tight">{notice.title}</h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 mb-8 pb-8 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {notice.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Eye size={14} />
                            {notice.views}
                        </div>
                    </div>

                    <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed min-h-[200px]">
                        <p>{notice.content}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeDetail;
