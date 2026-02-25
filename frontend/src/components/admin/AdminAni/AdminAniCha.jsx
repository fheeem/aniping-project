import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, ImageIcon } from 'lucide-react';

const AdminAniCha = ({ characters, setCharacters }) => {
    const [voiceActors, setVoiceActors] = useState([]); // 성우 목록

    useEffect(() => {
        // 성우 목록 로드 (가상의 API)
        // axios.get('/api/voice-actors').then(res => setVoiceActors(res.data));
        setVoiceActors([
            { id: 1, name: '성우1' },
            { id: 2, name: '성우2' },
            { id: 3, name: '성우3' },
        ]);
    }, []);

    const addCharacter = () => {
        setCharacters([...characters, { id: Date.now(), name: '', cvId: '', image: null, previewUrl: null, isNew: true }]);
    };

    const removeCharacter = (id) => {
        if (window.confirm("캐릭터를 삭제하시겠습니까?")) {
            setCharacters(characters.filter(char => char.id !== id));
        }
    };

    const handleInputChange = (id, field, value) => {
        setCharacters(characters.map(char => 
            char.id === id ? { ...char, [field]: value } : char
        ));
    };

    const handleImageChange = (id, e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCharacters(characters.map(char => 
                char.id === id ? { ...char, image: file, previewUrl: url } : char
            ));
        }
    };

    return (
        <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">등장인물 (캐릭터) 관리</h3>
            </div>

            <div className="space-y-4">
                {characters.map((char) => (
                    <div key={char.id} className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-200">
                        {/* 이미지 업로드 */}
                        <div className="relative w-24 h-32 bg-white rounded-lg border border-slate-300 flex items-center justify-center overflow-hidden flex-shrink-0 group">
                            {char.previewUrl ? (
                                <img src={char.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="text-slate-300" />
                            )}
                            <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                <Upload size={20} />
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(char.id, e)} />
                            </label>
                        </div>

                        {/* 정보 입력 */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">캐릭터 이름</label>
                                <input 
                                    type="text" 
                                    value={char.name} 
                                    onChange={(e) => handleInputChange(char.id, 'name', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                                    placeholder="이름 입력"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">성우 (CV)</label>
                                <select 
                                    value={char.cvId} 
                                    onChange={(e) => handleInputChange(char.id, 'cvId', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                                >
                                    <option value="">성우 선택</option>
                                    {voiceActors.map(va => (
                                        <option key={va.id} value={va.id}>{va.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 삭제 버튼 */}
                        <button 
                            onClick={() => removeCharacter(char.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}

                <button 
                    type="button"
                    onClick={addCharacter}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-primary hover:text-primary hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={20} /> 캐릭터 추가
                </button>
            </div>
        </div>
    );
};

export default AdminAniCha;
