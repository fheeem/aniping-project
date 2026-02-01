import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from 'lucide-react';

const UserLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);

  const handleEmail = (e) => {
    const { value } = e.target;
    setEmail(value);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    setEmailValid(regex.test(value));
  };

  const handlePw = (e) => {
    const { value } = e.target;
    setPw(value);
    const regex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    setPwValid(regex.test(value));
  };

  const onClickConfirmButton = (e) => {
    e.preventDefault();
    // Mock Login Logic
    if (email === "admin@aniping.com" && pw === "Password123!") {
      alert("로그인에 성공했습니다.");
      navigate("/"); // Go to Home
    } else {
      alert("이메일 또는 비밀번호를 확인해주세요.");
    }
  };

  // 테스트용 소셜 로그인 핸들러
  const handleSocialLoginTest = (provider) => {
    navigate('/join', { 
      state: { 
        email: `test_${provider.toLowerCase()}@social.com`, 
        social: provider 
      } 
    });
  };

  const isButtonDisabled = !emailValid || !pwValid;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md mx-auto bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-blue-50">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-800 mb-2">LOGIN</h2>
          <p className="text-slate-500 font-medium">애니핑에 오신 것을 환영합니다!</p>
        </div>

        <form onSubmit={onClickConfirmButton} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-600 ml-1">아이디 (이메일)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-700 placeholder:text-slate-400"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmail}
              />
            </div>
            {!emailValid && email.length > 0 && (
              <p className="text-xs font-bold text-red-500 ml-1">올바른 이메일을 입력해주세요.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-600 ml-1">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-700 placeholder:text-slate-400"
                placeholder="비밀번호를 입력하세요"
                value={pw}
                onChange={handlePw}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isButtonDisabled}
            className="w-full bg-primary text-white font-black text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0"
          >
            로그인
          </button>

          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="flex justify-center gap-4">
            <button type="button" onClick={() => handleSocialLoginTest('Google')} className="w-[10.5rem] h-14 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-colors">
              <img src="/images/btnLogin/web_light_sq_SU@1x.png" alt="Google" className="h-14 object-contain" />
            </button>
            <button type="button" onClick={() => handleSocialLoginTest('Kakao')} className="w-[10.5rem] h-14 flex items-center justify-center rounded-2xl hover:opacity-90 transition-opacity">
              <img src="/images/btnLogin/kakao_login_medium_narrow.png" alt="Kakao" className="h-14 object-contain" />
            </button>
          </div>

          <div className="text-center text-sm text-slate-500 pt-4">
            계정이 없으신가요?{' '}
            <Link to="/join" className="font-bold text-primary hover:underline">
              가입하기
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;