import { useState } from "react";
import { Search } from 'lucide-react';

const AdUserSearch = ({ searchLis, setSearchResult }) => {
    const [userInput, setUserInput] = useState('');

    const handleSearchChange = (e) => {
        setUserInput(e.target.value);
    }

    const handleClickSearch = () => {
        if (!userInput.trim()) {
            setSearchResult(searchLis);
        } else {
            const filteredText = searchLis.filter(searchL =>
                searchL.userId.toLowerCase().includes(userInput.toLowerCase())
            );
            setSearchResult(filteredText);
        }
    }
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleClickSearch();
        }
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="유저 아이디를 입력하여 검색하세요..."
                        value={userInput}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700"
                    />
                </div>
                <button 
                    onClick={handleClickSearch}
                    className="px-6 py-3 rounded-lg bg-primary text-white font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                    검색하기
                </button>
            </div>
        </div>
    )
}

export default AdUserSearch;
