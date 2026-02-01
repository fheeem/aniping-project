import { useState, useEffect } from 'react';
import { Tag, Plus, X, Save, ArrowUp, ArrowDown } from 'lucide-react';

const AdminAniTag = () => {
    const [tags, setTags] = useState([]);
    const [newTagName, setNewTagName] = useState('');
    const [newTagSlug, setNewTagSlug] = useState('');

    useEffect(() => {
        const storedTags = localStorage.getItem('admin_tags');
        if (storedTags) {
            setTags(JSON.parse(storedTags));
        } else {
            // 초기 데이터
            const initialTags = [
                { id: 1, name: '판타지', slug: 'fantasy' },
                { id: 2, name: '로맨스', slug: 'romance' },
                { id: 3, name: 'SF', slug: 'sf' },
                { id: 4, name: '일상', slug: 'normal' },
                { id: 5, name: '미스터리', slug: 'mystery' },
                { id: 6, name: '액션', slug: 'action' },
                { id: 7, name: '코미디', slug: 'comedy' },
            ];
            setTags(initialTags);
            localStorage.setItem('admin_tags', JSON.stringify(initialTags));
        }
    }, []);

    const handleAddTag = (e) => {
        e.preventDefault();
        if (!newTagName.trim() || !newTagSlug.trim()) {
            alert('태그 이름과 슬러그를 모두 입력해주세요.');
            return;
        }

        const newId = tags.length > 0 ? Math.max(...tags.map(t => t.id)) + 1 : 1;
        const newTag = {
            id: newId,
            name: newTagName,
            slug: newTagSlug
        };

        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        localStorage.setItem('admin_tags', JSON.stringify(updatedTags));
        
        setNewTagName('');
        setNewTagSlug('');
        alert(`'${newTagName}' 태그가 추가되었습니다.`);
    };

    const handleDeleteTag = (id, name) => {
        if (confirm(`'${name}' 태그를 삭제하시겠습니까?`)) {
            const updatedTags = tags.filter(tag => tag.id !== id);
            // ID 재정렬 (선택 사항, 여기서는 유지)
            setTags(updatedTags);
            localStorage.setItem('admin_tags', JSON.stringify(updatedTags));
        }
    };

    const moveTag = (index, direction) => {
        const newTags = [...tags];
        if (direction === 'up' && index > 0) {
            [newTags[index], newTags[index - 1]] = [newTags[index - 1], newTags[index]];
        } else if (direction === 'down' && index < newTags.length - 1) {
            [newTags[index], newTags[index + 1]] = [newTags[index + 1], newTags[index]];
        }
        
        // 순서 변경 후 ID 재할당 (순서가 중요하다면 ID도 순서대로 다시 매기는 것이 좋을 수 있음)
        // 여기서는 ID는 고유값으로 유지하고 순서만 변경
        setTags(newTags);
        localStorage.setItem('admin_tags', JSON.stringify(newTags));
    };

    // ID 재정렬 및 저장 함수 (명시적 저장 버튼용)
    const handleSaveOrder = () => {
        const reorderedTags = tags.map((tag, index) => ({
            ...tag,
            id: index + 1 // 순서대로 ID 재할당
        }));
        setTags(reorderedTags);
        localStorage.setItem('admin_tags', JSON.stringify(reorderedTags));
        alert('태그 순서와 번호가 저장되었습니다.');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            Animation Tags
                            <Tag className="text-primary" size={28} />
                        </h2>
                        <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">장르 및 태그 관리</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 태그 추가 폼 */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Plus size={18} /> 새 태그 추가
                            </h3>
                            <form onSubmit={handleAddTag} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-1">태그 이름 (한글)</label>
                                    <input 
                                        type="text" 
                                        placeholder="예: 스포츠" 
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-1">슬러그 (영문)</label>
                                    <input 
                                        type="text" 
                                        placeholder="예: sports" 
                                        value={newTagSlug}
                                        onChange={(e) => setNewTagSlug(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">URL 경로에 사용됩니다.</p>
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                >
                                    <Plus size={18} /> 추가하기
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* 태그 목록 */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-5 bg-slate-50/80 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-700">등록된 태그 목록 ({tags.length})</h3>
                                <button 
                                    onClick={handleSaveOrder}
                                    className="flex items-center gap-2 text-sm font-bold text-primary hover:text-blue-600 transition-colors"
                                >
                                    <Save size={16} /> 순서 저장 (ID 재정렬)
                                </button>
                            </div>
                            <ul className="divide-y divide-slate-100">
                                {tags.map((tag, index) => (
                                    <li key={tag.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-1 mr-2">
                                                <button 
                                                    onClick={() => moveTag(index, 'up')}
                                                    disabled={index === 0}
                                                    className="p-1 text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <ArrowUp size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => moveTag(index, 'down')}
                                                    disabled={index === tags.length - 1}
                                                    className="p-1 text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <ArrowDown size={16} />
                                                </button>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary font-bold">
                                                {tag.id}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-lg">{tag.name}</p>
                                                <p className="text-sm text-slate-400 font-medium">/list/{tag.slug}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteTag(tag.id, tag.name)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                            title="삭제"
                                        >
                                            <X size={20} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {tags.length === 0 && (
                                <div className="p-10 text-center text-slate-400">
                                    등록된 태그가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAniTag;
