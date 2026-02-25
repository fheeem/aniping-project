import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Check, AlertCircle, Mail, Lock, User, Phone, Calendar, Tv, X } from 'lucide-react';

const UserJoinForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSocial = location.state?.social && location.state?.social !== 'Local';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    nickname: '',
    age: '20',
    favoriteAni: '',
    social: ''
  });

  const [valid, setValid] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    phone: true,
    nickname: false,
    emailVerified: false
  });

  const [errors, setErrors] = useState({});
  const [messages, setMessages] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    nickname: ''
  });

  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isSocial) {
      const { email, social } = location.state;
      setFormData(prev => ({
        ...prev,
        email: email || '',
        social: social
      }));
      setValid(prev => ({
        ...prev,
        email: true,
        emailVerified: true
      }));
    }
  }, [isSocial, location.state]);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateEmail = async () => {
    if (isSocial) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: true }));
      setMessages(prev => ({ ...prev, email: '이메일 형식이 올바르지 않습니다.' }));
      setValid(prev => ({ ...prev, email: false }));
      return;
    }

    try {
      const response = await axios.get(`/api/user/check-id?loginId=${formData.email}`);
      if (response.data) {
        setErrors(prev => ({ ...prev, email: true }));
        setMessages(prev => ({ ...prev, email: '이미 사용 중인 아이디입니다.' }));
        setValid(prev => ({ ...prev, email: false }));
      } else {
        setErrors(prev => ({ ...prev, email: false }));
        setMessages(prev => ({ ...prev, email: '사용 가능한 아이디입니다.' }));
        setValid(prev => ({ ...prev, email: true }));
      }
    } catch (error) {
      console.error("Email check failed", error);
      setMessages(prev => ({ ...prev, email: '중복 확인 중 오류가 발생했습니다.' }));
    }
  };

  const handleEmailVerify = async () => {
    if (isSocial) return;

    if (!valid.email) {
      alert("올바른 이메일을 입력 후 중복 확인을 통과해야 합니다.");
      return;
    }
    
    try {
        await axios.post('/api/email/send', { email: formData.email });
        setShowVerifyPopup(true);
        setTimeLeft(300);
        setIsTimerActive(true);
        setCanResend(false);
        setVerifyCode('');
        alert(`[${formData.email}]로 인증 메일을 발송했습니다.`);
    } catch (error) {
        alert("인증 메일 발송에 실패했습니다.");
    }
  };

  const handleVerifySubmit = async () => {
    if (timeLeft === 0) {
        alert("인증 시간이 만료되었습니다. 재발급 받아주세요.");
        return;
    }
    if (verifyCode.length < 8) {
        alert("인증번호 8자리를 입력해주세요.");
        return;
    }
    
    try {
        await axios.post('/api/email/verify', { email: formData.email, code: verifyCode });
        alert("인증이 완료되었습니다.");
        setValid(prev => ({ ...prev, emailVerified: true }));
        setShowVerifyPopup(false);
        setIsTimerActive(false);
    } catch (error) {
        if (error.response?.status === 410) { // 410 Gone (만료)
            alert(error.response.data);
        } else {
            alert("인증 코드가 일치하지 않습니다.");
        }
    }
  };

  const handleResend = async () => {
    try {
        await axios.post('/api/email/send', { email: formData.email });
        setTimeLeft(300);
        setIsTimerActive(true);
        setCanResend(false);
        setVerifyCode('');
        alert(`[${formData.email}]로 인증 메일을 재발송했습니다.`);
    } catch (error) {
        alert("인증 메일 재발송에 실패했습니다.");
    }
  };

  const closeVerifyPopup = () => {
    setShowVerifyPopup(false);
  };

  const validatePassword = () => {
    const pwRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,20}$/;
    
    if (!pwRegex.test(formData.password)) {
      setErrors(prev => ({ ...prev, password: true }));
      setMessages(prev => ({ ...prev, password: '영문, 숫자, 특수문자 포함 7~20자로 입력해주세요.' }));
      setValid(prev => ({ ...prev, password: false }));
    } else {
      setErrors(prev => ({ ...prev, password: false }));
      setMessages(prev => ({ ...prev, password: '' }));
      setValid(prev => ({ ...prev, password: true }));
    }
    
    if (formData.confirmPassword) validateConfirmPassword();
  };

  const validateConfirmPassword = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: true }));
      setMessages(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }));
      setValid(prev => ({ ...prev, confirmPassword: false }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: false }));
      setMessages(prev => ({ ...prev, confirmPassword: '' }));
      setValid(prev => ({ ...prev, confirmPassword: true }));
    }
  };

  const validatePhone = () => {
    if (!formData.phone) {
        setValid(prev => ({ ...prev, phone: true }));
        setErrors(prev => ({ ...prev, phone: false }));
        setMessages(prev => ({ ...prev, phone: '' }));
        return;
    }
    
    const phoneRegex = /^[0-9]{10,17}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: true }));
      setMessages(prev => ({ ...prev, phone: '숫자만 10~17자로 입력해주세요.' }));
      setValid(prev => ({ ...prev, phone: false }));
    } else {
      setErrors(prev => ({ ...prev, phone: false }));
      setMessages(prev => ({ ...prev, phone: '' }));
      setValid(prev => ({ ...prev, phone: true }));
    }
  };

  const validateNickname = async () => {
    const nickRegex = /^[a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ]{1,20}$/;

    if (!nickRegex.test(formData.nickname)) {
      setErrors(prev => ({ ...prev, nickname: true }));
      setMessages(prev => ({ ...prev, nickname: '특수문자, 숫자 제외 1~20자로 입력해주세요.' }));
      setValid(prev => ({ ...prev, nickname: false }));
      return;
    }

    try {
      const response = await axios.get(`/api/user/check-nickname?nickname=${formData.nickname}`);
      if (response.data) {
        setErrors(prev => ({ ...prev, nickname: true }));
        setMessages(prev => ({ ...prev, nickname: '이미 사용 중인 닉네임입니다.' }));
        setValid(prev => ({ ...prev, nickname: false }));
      } else {
        setErrors(prev => ({ ...prev, nickname: false }));
        setMessages(prev => ({ ...prev, nickname: '사용 가능한 닉네임입니다.' }));
        setValid(prev => ({ ...prev, nickname: true }));
      }
    } catch (error) {
      console.error("Nickname check failed", error);
      setMessages(prev => ({ ...prev, nickname: '중복 확인 중 오류가 발생했습니다.' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!valid.email || !valid.password || !valid.confirmPassword || !valid.nickname) {
      alert("필수 입력 항목을 확인해주세요.");
      return;
    }

    if (!valid.emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }
    
    if (!valid.phone && formData.phone) {
        alert("전화번호 형식을 확인해주세요.");
        return;
    }

    try {
      const ageValue = parseInt(formData.age.replace(/[^0-9]/g, ''), 10) || 20;

      const joinData = {
        loginId: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        name: formData.nickname,
        email: formData.email,
        phoneNumber: formData.phone,
        age: ageValue,
        favoriteAni: formData.favoriteAni
      };

      const response = await axios.post('/api/user/join', joinData);

      if (response.status === 200) {
        alert(`${formData.nickname}님, 회원가입을 축하합니다!`);
        navigate('/');
      }
    } catch (error) {
      console.error("Join failed:", error);
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  const handleCancel = () => {
    if (window.confirm("작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?")) {
      navigate('/');
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-700 placeholder:text-slate-400";
  const errorClass = "border-red-400 focus:border-red-400 focus:ring-red-100";
  const successClass = "border-green-400 focus:border-green-400 focus:ring-green-100";

  const getBorderClass = (fieldName) => {
    if (errors[fieldName]) return errorClass;
    if (valid[fieldName] && formData[fieldName]) return successClass;
    return "";
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-blue-50 relative">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">JOIN US</h2>
        <p className="text-slate-500 font-medium">
          {isSocial ? `${formData.social} 계정으로 회원가입을 진행합니다.` : '애니핑의 회원이 되어 다양한 혜택을 누려보세요!'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-600 ml-1">아이디 (이메일) <span className="text-red-500">*</span></label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={validateEmail}
                placeholder="example@aniping.com"
                className={`${inputClass} ${getBorderClass('email')} ${isSocial ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                readOnly={isSocial}
              />
            </div>
            {!isSocial ? (
              <button 
                type="button"
                onClick={handleEmailVerify}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap
                  ${valid.emailVerified 
                    ? 'bg-green-500 text-white cursor-default' 
                    : 'bg-blue-50 text-primary hover:bg-blue-100'}`}
                disabled={valid.emailVerified}
              >
                {valid.emailVerified ? '인증 완료' : '인증하기'}
              </button>
            ) : (
              <div className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-500 border border-slate-200 whitespace-nowrap flex items-center">
                소셜 인증됨
              </div>
            )}
          </div>
          {!isSocial && messages.email && (
            <p className={`text-xs font-bold ml-1 flex items-center gap-1 ${errors.email ? 'text-red-500' : 'text-green-500'}`}>
              {errors.email ? <AlertCircle size={12} /> : <Check size={12} />}
              {messages.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-600 ml-1">비밀번호 <span className="text-red-500">*</span></label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={validatePassword}
              placeholder="영문, 숫자, 특수문자 포함 7~20자"
              className={`${inputClass} ${getBorderClass('password')}`}
            />
          </div>
          {messages.password && <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {messages.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-600 ml-1">비밀번호 확인 <span className="text-red-500">*</span></label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={validateConfirmPassword}
              placeholder="비밀번호를 다시 입력해주세요"
              className={`${inputClass} ${getBorderClass('confirmPassword')}`}
            />
          </div>
          {messages.confirmPassword && <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {messages.confirmPassword}</p>}
        </div>

        {/* Nickname */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-600 ml-1">닉네임 <span className="text-red-500">*</span></label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              onBlur={validateNickname}
              placeholder="특수문자, 숫자 제외 1~20자"
              className={`${inputClass} ${getBorderClass('nickname')}`}
            />
          </div>
          {messages.nickname && <p className={`text-xs font-bold ml-1 flex items-center gap-1 ${errors.nickname ? 'text-red-500' : 'text-green-500'}`}>{errors.nickname ? <AlertCircle size={12} /> : <Check size={12} />} {messages.nickname}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-600 ml-1">전화번호</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={validatePhone}
              placeholder="-없이 작성하세요"
              className={`${inputClass} ${getBorderClass('phone')}`}
            />
          </div>
          {messages.phone && <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {messages.phone}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-600 ml-1">나이</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select name="age" value={formData.age} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="10대">10대</option>
                <option value="20대">20대</option>
                <option value="30대">30대</option>
                <option value="40대">40대</option>
                <option value="50대 이상">50대 이상</option>
              </select>
            </div>
          </div>

          {/* Favorite Anime */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-600 ml-1">최애 애니</label>
            <div className="relative">
              <Tv className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" name="favoriteAni" value={formData.favoriteAni} onChange={handleChange} placeholder="가장 좋아하는 애니메이션은?" className={inputClass} />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button type="button" onClick={handleCancel} className="w-full bg-slate-200 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-300 transition-all">
            취소하기
          </button>
          <button type="submit" className="w-full bg-primary text-white font-black text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            회원가입
          </button>
        </div>
      </form>

      {/* Verification Popup */}
      {showVerifyPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={closeVerifyPopup}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">이메일 인증</h3>
            <p className="text-slate-500 text-sm text-center mb-6">
              {formData.email}로 전송된<br/>인증번호를 입력해주세요.
            </p>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="인증번호 입력"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-center text-lg tracking-widest"
                  maxLength={8}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-sm">
                  {formatTime(timeLeft)}
                </div>
              </div>

              <button
                onClick={handleVerifySubmit}
                disabled={timeLeft === 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all
                  ${timeLeft > 0 ? 'bg-primary hover:bg-primary/90' : 'bg-slate-300 cursor-not-allowed'}`}
              >
                인증하기
              </button>

              <button
                onClick={handleResend}
                disabled={!canResend}
                className={`w-full py-3 rounded-xl font-bold border transition-all
                  ${canResend 
                    ? 'border-primary text-primary hover:bg-blue-50' 
                    : 'border-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                인증번호 재발급
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserJoinForm;
