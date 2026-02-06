import { useState, useEffect } from 'react';
import axios from 'axios';
import ChaLineItem from './ChaLineItem';
import { Quote } from 'lucide-react';

const ChaLine = () => {
    const [lines, setLines] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLines = async () => {
        try {
            setLoading(true);
            // 백엔드 API 주소로 변경 (예: /api/lines/registered)
            const response = await axios.get('http://localhost:8080/api/lines/active');

            // 서버에서 이미 필터링해서 보내주겠지만, 안전하게 한 번 더 필터링하거나 그대로 사용
            setLines(response.data);
        } catch (e) {
            console.error("명대사를 불러오는 데 실패했습니다:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLines();
    }, []);

    if (loading) return <div className="text-center p-20">명대사 로딩 중...</div>;

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-[1440px] mx-auto">
                {/* 헤더 섹션 */}
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

                {/* 리스트 섹션 */}
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