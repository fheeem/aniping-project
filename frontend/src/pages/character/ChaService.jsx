import { useState, useEffect } from 'react';
import ChaDirect from './ChaDirect';
import ChaHistory from './ChaHistory';
import ChaQuestions from './ChaQuestions';
import { Search, HelpCircle, MessageCircle, History } from 'lucide-react';

const ChaService = () => {
    const [inquiries, setInquiries] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredInquiries, setFilteredInquiries] = useState([]);
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [active, setActive] = useState('questions');

    useEffect(() => {
        fetch("/api/cs/faq")
            .then((res) => res.json())
            .then((data) => {
                setFaqs(data);
                setFilteredFaqs(data);
            })
            .catch((err) => console.error("FAQ 로딩 실패:", err));
    }, []);

    const handleSearch = () => {
        const query = searchTerm.toLowerCase().trim();

        if (!query) {
            setFilteredFaqs(faqs);
            setFilteredInquiries(inquiries);
            return;
        }

        const faqResults = faqs.filter((f) =>
            String(f.question || '').toLowerCase().includes(query) ||
            String(f.answer || '').toLowerCase().includes(query)
        );

        const inquiryResults = inquiries.filter((i) =>
            String(i.title || '').toLowerCase().includes(query) ||
            String(i.content || '').toLowerCase().includes(query)
        );

        setFilteredFaqs(faqResults);
        setFilteredInquiries(inquiryResults);

        if (faqResults.length > 0) {
            setActive('questions');
        } else if (inquiryResults.length > 0) {
            setActive('history');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const addInquiry = (newInquiry) => {
        const inquiryData = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            status: '접수 완료',
            ...newInquiry,
        };
        setInquiries((prev) => {
            const next = [...prev, inquiryData];
            setFilteredInquiries(next);
            return next;
        });
        setActive('history');
    };

    const renderContent = () => {
        if (active === 'questions') return <ChaQuestions data={filteredFaqs} />;
        if (active === 'direct') return <ChaDirect onAddInquiry={addInquiry} setActive={setActive} />;
        if (active === 'history') return <ChaHistory history={filteredInquiries} />;
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">Customer Service</h2>
                    <p className="text-slate-500 font-medium">How can we help you today?</p>
                </div>

                <div className="relative max-w-xl mx-auto mb-12">
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요..."
                        className="w-full pl-6 pr-14 py-4 rounded-full bg-white border border-blue-100 shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/10 font-bold text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-2 top-2 p-3 bg-primary text-white rounded-full hover:bg-blue-600 transition-all shadow-md active:scale-95"
                    >
                        <Search size={20} />
                    </button>
                </div>

                <div className="flex justify-center gap-4 mb-12">
                    <button onClick={() => setActive('questions')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${active === 'questions' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-500'}`}>
                        <HelpCircle size={18} /> FAQ
                    </button>
                    <button onClick={() => setActive('direct')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${active === 'direct' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-500'}`}>
                        <MessageCircle size={18} /> 1:1 Inquiry
                    </button>
                    <button onClick={() => setActive('history')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${active === 'history' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-500'}`}>
                        <History size={18} /> My History
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl border border-blue-50/50 p-8 md:p-12 min-h-[400px]">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ChaService;