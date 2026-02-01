import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, Save } from 'lucide-react';

const AdminChaFLLiEd = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new';

    const [chaFLLiEd, setChaFLLiEd] = useState({
        image: '',
        title: '',
        content: '',
        user:'',
        date:'',
        status
    });

    useEffect(() => {
        const loadData = async () => {
            let chaFLs = [];
            const storedChaFLs = localStorage.getItem('admin_chaFLs');
            
            if (storedChaFLs) {
                chaFLs = JSON.parse(storedChaFLs);
            } else {
                try {
                    const response = await axios.get('/data/adminChaLine.json');
                    chaFLs = response.data;
                    localStorage.setItem('admin_chaFLs', JSON.stringify(chaFLs));
                } catch (e) {
                    console.error(e);
                }
            }

            if (!isNew) {
                const target = chaFLs.find(item => item.id === Number(id));
                if (target) {
                    setChaFLLiEd(target);
                }
            }
        };
        loadData();
    }, [id, isNew]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChaFLLiEd(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const storedChaFLs = localStorage.getItem('admin_chaFLs');
        let chaFLs = storedChaFLs ? JSON.parse(storedChaFLs) : [];

        if (isNew) {
            const newId = chaFLs.length > 0 ? Math.max(...chaFLs.map(item => item.id)) + 1 : 1;
            chaFLs.push({ ...chaFLLiEd, id: newId });
            alert('새 명대사가 추가되었습니다.');
        } else {
            chaFLs = chaFLs.map(item =>
                item.id === Number(id) ? { ...chaFLLiEd, id: Number(id) } : item
            );
            alert('명대사가 수정되었습니다.');
        }

        localStorage.setItem('admin_chaFLs', JSON.stringify(chaFLs));
        navigate('/AdminChaFL');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate('/AdminChaFL')} className="flex items-center gap-1 text-slate-500 hover:text-primary font-bold mb-8 transition-colors">
                    <ChevronLeft size={20} />
                    Back to List
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <h1 className="text-2xl font-black text-slate-800 mb-8">
                        {isNew ? 'Add New Famous Line' : 'Edit Famous Line'}
                    </h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-bold text-slate-600 mb-1">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={chaFLLiEd.title || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-slate-100 border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-sm font-bold text-slate-600 mb-1">Content</label>
                            <textarea
                                id="content"
                                name="content"
                                value={chaFLLiEd.content || ''}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg bg-slate-100 border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-bold text-slate-600 mb-1">Image URL</label>
                            <input
                                type="text"
                                id="image"
                                name="image"
                                value={chaFLLiEd.image || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-slate-100 border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        
                        <div className="flex justify-end pt-4">
                            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                <Save size={18} />
                                {isNew ? 'Save' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminChaFLLiEd;
