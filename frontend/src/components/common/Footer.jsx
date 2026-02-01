import { Link } from "react-router-dom";
import { Sparkles, Heart } from "lucide-react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="mt-40 border-t border-blue-50 bg-gradient-to-b from-white to-blue-50/30 py-20 px-6 md:px-12 text-[13px] text-slate-500">
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="space-y-8 max-w-sm">
                    <div className="flex items-center gap-2">
                        <img src="/images/headerLogo/AnipingLogoNoBack.png" alt="애니핑" className="h-20 w-auto mix-blend-multiply" />
                        <Sparkles className="text-primary animate-pulse" size={16} />
                    </div>
                    <div className="space-y-2 font-medium leading-relaxed">
                        <p className="text-slate-800 font-bold text-base">서면 삼정옆 M아카데미</p>
                        <p>사업자명: 애니 애호가</p>
                        <p className="text-slate-400 italic">푸터센터1: 원하는 디자인으로</p>
                        <p className="text-slate-400 italic">푸터센터2: 수정 해도 되는 부분 ㅇㅇ</p>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <Heart size={14} fill="currentColor" />
                        <span>애니메이션과 함께하는 일상</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 md:gap-24">
                    <div className="space-y-6">
                        <h4 className="text-slate-900 font-black text-xs uppercase tracking-[0.2em]">Service</h4>
                        <div className="flex flex-col gap-4 font-semibold">
                            <Link to="https://naver.com" className="hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-primary"></span>
                                고객센터 링크 자리 1
                            </Link>
                            <Link to="https://naver.com" className="hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-primary"></span>
                                고객센터 링크 자리 2
                            </Link>
                            <Link to="https://naver.com" className="hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-primary"></span>
                                고객센터 링크 자리 3
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-[1400px] mx-auto mt-20 pt-10 border-t border-blue-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-slate-400 tracking-widest uppercase">
                <p>© 2026 ANIPING. MADE WITH LOVE FOR ANIME.</p>
                <div className="flex gap-8">
                    <button className="hover:text-primary transition-colors">Privacy</button>
                    <button className="hover:text-primary transition-colors">Terms</button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;