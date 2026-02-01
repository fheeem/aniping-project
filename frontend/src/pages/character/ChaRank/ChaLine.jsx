import { useState, useEffect } from 'react';
import axios from 'axios';
import ChaLineItem from './ChaLineItem';
import { Quote } from 'lucide-react';

const ChaLine = () => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const loadData = async () => {
        let allLines = [];
        const storedChaFLs = localStorage.getItem('admin_chaFLs');
        if (storedChaFLs) {
            allLines = JSON.parse(storedChaFLs);
        } else {
            try {
                const response = await axios.get('/data/adminChaLine.json');
                allLines = response.data;
                localStorage.setItem('admin_chaFLs', JSON.stringify(allLines));
            } catch (e) {
                console.error("Failed to load adminChaLine.json:", e);
            }
        }
        // 'registered' 상태인 명대사만 필터링
        const registeredLines = allLines.filter(line => line.status === 'registered');
        setLines(registeredLines);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center gap-4 mb-12">
            <div className="w-1.5 h-10 bg-primary rounded-full"></div>
            <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    Famous Lines
                    <Quote className="text-primary" size={24} />
                </h2>
                <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">Unforgettable Moments</p>
            </div>
        </div>

        {lines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lines.map((line) => (
                    <ChaLineItem key={line.id} line={line} />
                ))}
            </div>
        ) : (
            <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                <Quote size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-bold text-lg">등록된 명대사가 없습니다.</p>
            </div>
        )}
      </div>
    </div>
  );
};
export default ChaLine;
