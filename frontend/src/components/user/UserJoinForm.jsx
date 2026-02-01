import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Check, AlertCircle, Mail, Lock, User, Phone, Calendar, Tv } from 'lucide-react';

const UserJoinForm = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 소셜 로그인 정보 수신용
  const [users, setUsers] = useState([]);

  // 소셜 로그인 여부 판단
  const isSocial = location.state?.social && location.state?.social !== 'Local';

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    nickname: '',
    age: '20대',
    favoriteAni: '',
    social: 'Local' // 기본값 Local
  });

  // Validation State
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    phone: true,
    nickname: false,
    emailVerified: false
  });

  // Messages
  const [messages, setMessages] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    nickname: ''
  });

  useEffect(() => {
    // 1. Mock Data 로드
    axios.get('/data/userData.json')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to load user data", err));

    // 2. 소셜 로그인 정보가 있다면 초기값 설정
    if (isSocial) {
      const { email, social } = location.state;
      setFormData(prev => ({
        ...prev,
        email: email || '',
        social: social
      }));
      
      // 소셜 로그인은 이메일 검증/중복체크 패스
      setValid(prev => ({
        ...prev,
        email: true,
        emailVerified: true
      }));
    }
  }, [isSocial, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 1-1. Email Validation & Duplicate Check
  const validateEmail = () => {
    // 소셜 로그인이면 검사 건너뜀
    if (isSocial) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: true }));
      setMessages(prev => ({ ...prev, email: '이메일 형식이 올바르지 않습니다.' }));
      setValid(prev => ({ ...prev, email: false }));
      return;
    }

    const isDuplicate = users.some(user => user.email === formData.email);
    if (isDuplicate) {
      setErrors(prev => ({ ...prev, email: true }));
      setMessages(prev => ({ ...prev, email: '이미 사용 중인 아이디입니다.' }));
      setValid(prev => ({ ...prev, email: false }));
    } else {
      setErrors(prev => ({ ...prev, email: false }));
      setMessages(prev => ({ ...prev, email: '사용 가능한 아이디입니다.' }));
      setValid(prev => ({ ...prev, email: true }));
    }
  };

  const handleEmailVerify = () => {
    if (isSocial) return; // 소셜은 동작 안함

    if (!valid.email) {
      alert("올바른 이메일을 입력 후 중복 확인을 통과해야 합니다.");
      return;
    }
    alert(`[${formData.email}]로 인증 메일을 발송했습니다.\n(임의로 인증 처리됩니다)`);
    setValid(prev => ({ ...prev, emailVerified: true }));
  };

  // 1-2. Password Validation
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

  // 1-3. Confirm Password Validation
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

  // 1-4. Phone Validation
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

  // 1-5. Nickname Validation
  const validateNickname = () => {
    const nickRegex = /^[a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ]{1,20}$/;

    if (!nickRegex.test(formData.nickname)) {
      setErrors(prev => ({ ...prev, nickname: true }));
      setMessages(prev => ({ ...prev, nickname: '특수문자, 숫자 제외 1~20자로 입력해주세요.' }));
      setValid(prev => ({ ...prev, nickname: false }));
      return;
    }

    const isDuplicate = users.some(user => user.nickname === formData.nickname);
    if (isDuplicate) {
      setErrors(prev => ({ ...prev, nickname: true }));
      setMessages(prev => ({ ...prev, nickname: '이미 사용 중인 닉네임입니다.' }));
      setValid(prev => ({ ...prev, nickname: false }));
    } else {
      setErrors(prev => ({ ...prev, nickname: false }));
      setMessages(prev => ({ ...prev, nickname: '사용 가능한 닉네임입니다.' }));
      setValid(prev => ({ ...prev, nickname: true }));
    }
  };

  const handleSubmit = (e) => {
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

    alert(`${formData.nickname}님, 회원가입을 축하합니다! (${formData.social} 계정)`);
    console.log("Registered User:", formData);
    navigate('/');
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
    <div className="w-full max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-blue-50">
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
    </div>
  );
};

export default UserJoinForm;
