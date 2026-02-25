import { Link } from "react-router-dom";
import { useState } from "react";
import { Search, X, User, ChevronDown, Shield, LogOut } from "lucide-react";
import { useUser } from "../../context/UserContext";
import './Header.css';

const Header = () => {
    const { isLoggedIn, userType, logout } = useUser();
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const menuItems = [
        {
            name: "장르",
            items: [
                { name: "판타지", link: "/list/fantasy" },
                { name: "로맨스", link: "/list/romance" },
                { name: "SF", link: "/list/sf" },
                { name: "일상", link: "/list/normal" },
                { name: "미스터리", link: "/list/mystery" }
            ]
        },
        {
            name: "목록",
            items: [
                { name: "캐릭터 랭킹", link: "/chaRankPage" },
                { name: "명대사", link: "/chaLine" },
                { name: "성우", link: "/chaCvList" }
            ]
        },
        // 고객센터 하위 메뉴를 1차 카테고리로 분리
        {
            name: "고객센터", // 기존 고객센터 링크
            link: "/service" // 1차 메뉴로 바로 연결
        },
        {
            name: "자유게시판", // 1차 메뉴로 승격
            link: "/chaPost"
        },
        {
            name: "공지사항", // 1차 메뉴로 승격
            link: "/notice"
        },
    ];

    const handleClickSearchBtn = () => {
        setIsOpenSearch(!isOpenSearch);
        if (isOpenSearch) {
            setSearchTerm("");
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            console.log("검색 요청:", searchTerm);
        }
    };

    return (
        <>
            <header className="fixed top-0 left-0 w-full h-20 glass-panel z-[500] flex items-center px-6 md:px-12 border-b border-blue-50/50">
                <div className="flex-1">
                    <Link to="/">
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <img src="/images/headerLogo/AnipingLogoNoBack.png" alt="AniPing" className="h-16 w-auto transition-transform group-hover:scale-105" />
                        </div>
                    </Link>
                </div>

                <nav className="hidden md:flex flex-[2] justify-center space-x-10 h-full items-center">
                    {menuItems.map((menu) => (
                        // 드롭다운이 있는 메뉴와 없는 메뉴를 구분하여 렌더링
                        menu.items ? ( // 드롭다운 메뉴
                            <div 
                                key={menu.name}
                                className="relative h-full flex items-center group"
                                onMouseEnter={() => setActiveDropdown(menu.name)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button className="flex items-center gap-1.5 text-[14px] font-bold text-slate-600 hover:text-primary transition-all cursor-pointer relative py-2 bg-transparent">
                                    {menu.name}
                                    <ChevronDown size={14} className={`transition-transform duration-300 opacity-50 ${activeDropdown === menu.name ? 'rotate-180' : ''}`} />
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                </button>
                                
                                <div className={`absolute top-[80%] left-1/2 -translate-x-1/2 w-48 bg-white/90 backdrop-blur-xl border border-blue-50 shadow-[0_20px_40px_-15px_rgba(125,211,252,0.3)] transition-all duration-500 origin-top rounded-2xl overflow-hidden p-2 ${activeDropdown === menu.name ? 'opacity-100 translate-y-2 visible' : 'opacity-0 translate-y-0 invisible'}`}>
                                    <ul className="space-y-1">
                                        {menu.items.map((item) => (
                                            <li key={item.name}>
                                                <Link to={item.link} className="block px-4 py-2.5 text-[12px] font-semibold text-slate-500 hover:text-primary hover:bg-blue-50/50 rounded-xl transition-all">
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : ( // 단일 링크 메뉴
                            <div key={menu.name} className="relative h-full flex items-center group">
                                <Link to={menu.link} className="flex items-center gap-1.5 text-[14px] font-bold text-slate-600 hover:text-primary transition-all cursor-pointer relative py-2 bg-transparent">
                                    {menu.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                </Link>
                            </div>
                        )
                    ))}
                </nav>

                <div className="flex-1 flex justify-end items-center space-x-4">
                    <div className="hidden lg:flex items-center space-x-6 text-[13px] font-bold">
                        {isLoggedIn ? (
                            <ul className="flex items-center space-x-6">
                                {userType === 'admin' && (
                                    <li><Link to="/AdminBoard" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-2"><Shield size={16} /> Admin</Link></li>
                                )}
                                {userType === 'user' && (
                                    <li><Link to="/user" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-2"><User size={16} /> MyPage</Link></li>
                                )}
                                <li><button onClick={logout} className="text-slate-600 hover:text-primary transition-colors bg-transparent flex items-center gap-2"><LogOut size={16} /> LogOut</button></li>
                            </ul>
                        ) : (
                            <ul className="flex items-center space-x-6">
                                <li><Link to="/login" className="text-slate-500 hover:text-primary transition-colors uppercase tracking-wider">LOGIN</Link></li>
                                <li><Link to="/join" className="bg-primary text-white px-7 py-2.5 rounded-full hover:shadow-[0_10px_20px_-5px_rgba(125,211,252,0.5)] hover:-translate-y-0.5 transition-all uppercase tracking-wider">JOIN</Link></li>
                            </ul>
                        )}
                    </div>
                    <button 
                        onClick={handleClickSearchBtn}
                        className={`p-2 rounded-full transition-colors ${isOpenSearch ? 'bg-blue-50 text-primary' : 'hover:bg-blue-50 text-slate-400 hover:text-primary'} bg-transparent`}
                    >
                        {isOpenSearch ? <X size={22} /> : <Search size={22} />}
                    </button>
                </div>
            </header>

            {/* 검색바 영역 */}
            <div className={`fixed top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-blue-50 shadow-lg z-[490] transition-all duration-300 overflow-hidden ${isOpenSearch ? 'h-24 opacity-100 visible' : 'h-0 opacity-0 invisible'}`}>
                <div className="max-w-[1440px] mx-auto h-full flex items-center justify-center px-6 md:px-12">
                    <form onSubmit={handleSearchSubmit} className="w-full max-w-3xl relative flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="검색어를 입력하세요..." 
                                className="w-full pl-14 pr-6 py-4 rounded-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700 placeholder:text-slate-400 text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus={isOpenSearch}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Header;
