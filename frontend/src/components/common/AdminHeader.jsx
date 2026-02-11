import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users, Clapperboard, Mic, ShieldQuestion, Settings, LogOut,
    ChevronDown, UserCircle, ChevronsLeft, ChevronsRight, Megaphone, Home
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import './AdminHeader.css';

const AdminHeader = ({ isCollapsed, toggleSidebar }) => {
    const { logout } = useUser(); // logout 함수 가져오기
    const navigate = useNavigate(); // useNavigate 훅 사용
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({});

    useEffect(() => {
        const currentMenu = navItems.find(item => 
            item.subItems?.some(sub => sub.path === location.pathname) || item.path === location.pathname
        );
        if (currentMenu) {
            setOpenMenus(prev => ({ ...prev, [currentMenu.name]: true }));
        }
    }, [location.pathname]);

    const toggleMenu = (menuName) => {
        if (!isCollapsed) {
            setOpenMenus(prev => ({
                ...prev,
                [menuName]: !prev[menuName]
            }));
        }
    };

    const handleLogout = async () => {
        await logout(); // UserContext의 logout 함수 호출
        navigate('/'); // 로그아웃 후 사이트 홈으로 이동
    };

    const navItems = [
        { name: "대시보드", icon: <LayoutDashboard size={20} />, path: "/AdminBoard", subItems: [] },
        {
            name: "사용자 관리",
            icon: <Users size={20} />,
            subItems: [
                { name: "사용자 목록", path: "/AdUserLi" },
                { name: "운영진 설정", path: "/AdminSetting" },
            ]
        },
        {
            name: "애니메이션 관리",
            icon: <Clapperboard size={20} />,
            subItems: [
                { name: "애니메이션 관리", path: "/AdminAni" },
                { name: "애니메이션 태그 관리", path: "/AdminAni/tag" },
            ]
        },
        {
            name: "캐릭터 관리",
            icon: <Mic size={20} />,
            subItems: [
                { name: "캐릭터 게시판", path: "/AdminChaBoard" },
                { name: "캐릭터 명대사", path: "/AdminChaFL" },
                { name: "성우 관리", path: "/AdminVA" },
            ]
        },
        {
            name: "고객센터 관리",
            icon: <ShieldQuestion size={20} />,
            subItems: [
                { name: "1:1 문의", path: "/AdCuSeAsk" },
                { name: "자주 묻는 질문", path: "/AdFAQ" },
            ]
        },
        { name: "공지사항", icon: <Megaphone size={20} />, path: "/AdminNotice", subItems: [] }
    ];

    return (
        <aside 
            className={`bg-white shadow-lg flex flex-col h-screen fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
            {/* Admin Info */}
            <div className={`p-4 border-b border-slate-100 text-center transition-all duration-300 overflow-hidden ${isCollapsed ? 'h-0 p-0 opacity-0' : 'h-auto p-6 opacity-100'}`}>
                <UserCircle size={48} className="text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-slate-800 whitespace-nowrap">Admin Name</p>
                <p className="text-sm text-slate-500 whitespace-nowrap">admin@aniping.com</p>
                {/* 사이트 홈으로 가는 버튼 */}
                <Link 
                    to="/" 
                    className="mt-4 flex items-center justify-center gap-2 text-primary hover:text-blue-700 font-semibold transition-colors"
                >
                    <Home size={18} />
                    {!isCollapsed && <span>사이트 홈</span>}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            {item.subItems.length > 0 ? (
                                <>
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className={`flex items-center justify-between w-full p-3 rounded-lg text-left font-semibold transition-colors text-slate-700 hover:bg-slate-100 ${isCollapsed ? 'justify-center' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                                        </div>
                                        {!isCollapsed && <ChevronDown size={16} className={`transition-transform duration-200 ${openMenus[item.name] ? 'rotate-180' : ''}`} />}
                                    </button>
                                    <div 
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${!isCollapsed && openMenus[item.name] ? 'max-h-96' : 'max-h-0'}`}
                                    >
                                        <ul className="flex flex-col pt-1 pl-8 space-y-1">
                                            {item.subItems.map((subItem) => (
                                                <li key={subItem.name}>
                                                    <Link
                                                        to={subItem.path}
                                                        className={`block p-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                                                            ${location.pathname === subItem.path ? 'text-primary bg-blue-50' : 'text-slate-600 hover:bg-slate-100'}`}
                                                    >
                                                        - {subItem.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 w-full p-3 rounded-lg text-left font-semibold transition-colors 
                                        ${location.pathname === item.path ? 'bg-blue-50 text-primary' : 'text-slate-700 hover:bg-slate-100'}
                                        ${isCollapsed ? 'justify-center' : ''}`}
                                >
                                    {item.icon}
                                    {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Toggle & Logout */}
            <div className="p-2 border-t border-slate-100">
                <button 
                    onClick={toggleSidebar} 
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
                >
                    {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
                </button>
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 w-full p-3 mt-1 rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="whitespace-nowrap">로그아웃</span>}
                </button>
            </div>
        </aside>
    );
};

export default AdminHeader;
