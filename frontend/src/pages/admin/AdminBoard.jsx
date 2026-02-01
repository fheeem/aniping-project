import { Link } from 'react-router-dom';
import { Users, Clapperboard, Mic, ShieldQuestion, ArrowRight, Bell, CheckCircle } from 'lucide-react';

const AdminBoard = () => {

    const mainCards = [
        { title: "사용자 관리", icon: <Users />, link: "/AdUserLi", items: ["신규 가입자", "운영진 설정"] },
        { title: "애니메이션 관리", icon: <Clapperboard />, link: "/AdminAni", items: ["애니메이션 리스트", "태그 관리"] },
        { title: "캐릭터 관리", icon: <Mic />, link: "/AdminChaBoard", items: ["캐릭터 신청", "명대사 관리", "성우 관리"] },
        { title: "고객센터 관리", icon: <ShieldQuestion />, link: "/AdCuSeAsk", items: ["1:1 문의 관리", "자주 묻는 질문"] },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-black text-slate-800 mb-10">Admin Dashboard</h1>

                {/* Main Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    {mainCards.map(card => (
                        <Link to={card.link} key={card.title} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-100 text-primary rounded-lg">
                                    {card.icon}
                                </div>
                                <ArrowRight className="text-slate-300 group-hover:text-primary transition-colors group-hover:translate-x-1" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-700 mb-2">{card.title}</h2>
                            <div className="text-sm text-slate-400 space-y-1">
                                {card.items.map(item => <p key={item}>- {item}</p>)}
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Today's Tasks */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Bell className="text-primary" />
                            오늘의 할 일
                        </h2>
                        <ul className='space-y-4'>
                            <li className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                                <p className="font-bold text-yellow-700">답변대기 문의</p>
                                <p className="font-black text-2xl text-yellow-600">0</p>
                            </li>
                            <li className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                                <p className="font-bold text-red-700">신고받은 댓글 관리</p>
                                <p className="font-black text-2xl text-red-600">0</p>
                            </li>
                        </ul>
                    </div>

                    {/* Notices & Others */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className="text-lg font-bold text-slate-800">공지사항</h2>
                                <Link to="/AdminNotice" className="text-sm font-bold text-primary hover:underline">더보기</Link>
                            </div>
                            <div className='space-y-3 text-slate-600'>
                                <p className="truncate">- 시스템 점검 안내 (08/15)</p>
                                <p className="truncate">- 관리자 가이드 업데이트</p>
                                <p className="truncate">- 신규 기능 추가 안내</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className="text-lg font-bold text-slate-800">전체보기</h2>
                                <Link to="#" className="text-sm font-bold text-primary hover:underline">더보기</Link>
                            </div>
                            <div className='space-y-3 text-slate-600'>
                                <p className="truncate">- 최신 애니메이션 등록: '귀멸의 칼날 4기'</p>
                                <p className="truncate">- 신규 사용자 가입: 'testuser'</p>
                                <p className="truncate">- '리바이' 캐릭터 정보 업데이트</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage Guide */}
                <div className='mt-10 bg-gradient-to-r from-primary to-blue-400 text-white p-8 rounded-2xl shadow-lg'>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <CheckCircle />
                        사용가이드
                    </h2>
                    <p>관리자 대시보드 사용법 및 주요 기능에 대한 안내입니다. 각 섹션의 '바로가기'를 통해 빠르게 이동할 수 있습니다.</p>
                </div>
            </div>
        </div>
    )
}

export default AdminBoard;
