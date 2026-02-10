import { useState, useEffect } from 'react';
import ChaCvListItem from './ChaCvListItem';
import { Mic2 } from 'lucide-react';
import axios from 'axios'; // axios 추가

const ChaCvList = () => {
    const [cvList, setCvList] = useState([]);

    useEffect(() => {
        // 백엔드 API 호출
        axios.get("/api/cv/ranking")
            .then((res) => {
                // 백엔드에서 이미 정렬된 데이터를 주므로 rank만 추가
                const mappedData = res.data.map((item, index) => ({
                    ...item,
                    rank: index + 1
                }));
                setCvList(mappedData);
            })
            .catch((err) => console.error("성우 데이터 로딩 실패:", err));
    }, []);

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            Voice Actors
                            <Mic2 className="text-primary" size={24} />
                        </h2>
                        <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">Top Voice Actors Ranking</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-blue-50/50 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-6 bg-slate-50/50 border-b border-blue-50 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-3 text-left pl-8">Voice Actor</div>
                        <div className="col-span-8 text-left pl-4">Works</div>
                    </div>

                    <ul className="divide-y divide-blue-50">
                        {cvList.map((cv) => (
                            <ChaCvListItem key={cv.id} cv={cv} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ChaCvList;