import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Tag, Plus, X, Save, ArrowUp, ArrowDown } from 'lucide-react';

const AdminAniTag = () => {
    const [tags, setTags] = useState([]);
    const [newTagName, setNewTagName] = useState('');
    const [newTagSlug, setNewTagSlug] = useState('');

    const fetchData = useCallback(async () => {
        try{
            const response = await axios.get('/api/AdminAni/tag');
            const data = response.data || [];
            setTags(data);
        }catch(e){
            console.error('데이터 로드 실패: ', e);
            setTags([]);
        }
    },[]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddTag = async (e) => {
        e.preventDefault();

        if (!/^[가-힣]+$/.test(newTagName)) {
            alert("태그 이름에는 한글만 입력해주세요.");
            return;
        }
        if (!/^[a-zA-Z]+$/.test(newTagSlug)) {
            alert("슬러그에는 영어만 입력해주세요.");
            return;
        }

        if (!newTagName.trim()) {
            alert('태그 이름을 입력해주세요.');
            return;
        }
        try{
            const tagData = {
                name: newTagName,
                slug: newTagSlug
            };

            await axios.post('/api/AdminAni/tag/create', tagData);
            alert("등록 성공!");

            setNewTagName('');
            setNewTagSlug('');

            fetchData();

        }catch(e){
            if (e.response && e.response.status === 400) {
                alert(e.response.data);
            } else {
                alert("저장 중 오류가 발생했습니다.");
            }
        }
    }

    const handleDeleteTag = async (id, name) => {
        if (confirm(`'${name}' 태그를 삭제하시겠습니까?`)) {
            try {
                await axios.delete(`/api/AdminAni/tag/${id}`);
                alert("삭제되었습니다.");
                fetchData(); // 삭제 후 목록 새로고침
            } catch (e) {
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    const moveTag = async (id, direction) => {
        try {
            if(direction === 'up'){
                await axios.patch(`/api/AdminAni/tag/${id}/up`);
            } else if(direction == 'down'){
                await axios.patch(`/api/AdminAni/tag/${id}/down`);
            }
            fetchData();
        } catch (e) {
            console.error('순서 변경 실패:', e);
            alert("순서 변경에 실패했습니다.");
        }
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
                                        onChange={(e) =>{
                                            const inputValue = e.target.value;
                                            const koreanRegex = /^[가-힣ㄱ-ㅎㅏ-ㅣ]*$/;
                                            if (!koreanRegex.test(inputValue)) {
                                                alert("한글만 입력 가능합니다.");
                                                const onlyKorean = inputValue.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
                                                setNewTagName(onlyKorean);
                                            } else {
                                                setNewTagName(inputValue);
                                            }
                                        }}
                                        className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-1">슬러그 (영문)</label>
                                    <input 
                                        type="text" 
                                        placeholder="예: sports" 
                                        value={newTagSlug}
                                        onChange={(e) =>{
                                            const inputValue = e.target.value;
                                            const pureEnglishRegex = /^[a-zA-Z]*$/;
                                            if (!pureEnglishRegex.test(inputValue)) {
                                                alert("영어만 입력 가능합니다.");
                                                const onlyEnglish = inputValue.replace(/[^a-zA-Z]/g, '');
                                                setNewTagSlug(onlyEnglish);
                                            } else {
                                                setNewTagSlug(inputValue);
                                            }
                                        }}
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
                            </div>
                            <ul className="divide-y divide-slate-100">
                                {tags.map((tag, index) => (
                                    <li key={tag.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-1 mr-2">
                                                <button
                                                    onClick={() => moveTag(tag.id, 'up')}
                                                    disabled={index === 0}
                                                    className="p-1 text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <ArrowUp size={16} />
                                                </button>
                                                <button
                                                    onClick={() => moveTag(tag.id, 'down')}
                                                    disabled={index === tags.length - 1}
                                                    className="p-1 text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <ArrowDown size={16} />
                                                </button>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary font-bold">
                                                {tag.sequence}
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
