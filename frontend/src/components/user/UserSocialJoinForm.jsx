import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Phone, Calendar, Tv } from 'lucide-react';

const UserSocialJoinForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        social: '',
        nickname: '',
        phoneNumber: '',
        age: '20',
        favoriteAni: ''
    });
    const [nicknameValid, setNicknameValid] = useState(false);
    const [nicknameMsg, setNicknameMsg] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const email = params.get('email');
        const name = params.get('name');
        const social = params.get('social');

        if (email && name && social) {
            setFormData(prev => ({ ...prev, email, name, social }));
        } else {
            // 필수 정보 없으면 로그인 페이지로
            navigate('/login');
        }
    }, [location, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const checkNickname = async () => {
        if (!formData.nickname) {
            setNicknameMsg('닉네임을 입력해주세요.');
            setNicknameValid(false);
            return;
        }
        try {
            const response = await axios.get(`/api/user/check-nickname?nickname=${formData.nickname}`);
            if (response.data) {
                setNicknameMsg('이미 사용 중인 닉네임입니다.');
                setNicknameValid(false);
            } else {
                setNicknameMsg('사용 가능한 닉네임입니다.');
                setNicknameValid(true);
            }
        } catch (error) {
            setNicknameMsg('닉네임 확인 중 오류가 발생했습니다.');
            setNicknameValid(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nicknameValid) {
            alert('닉네임 중복 확인을 해주세요.');
            return;
        }

        try {
            await axios.post('/api/oauth/join', formData);
            alert('회원가입이 완료되었습니다. 자동으로 로그인됩니다.');
            // 성공 후 홈으로 이동 (백엔드에서 로그인 처리 후 리다이렉트 하므로, 여기서는 홈으로만)
            window.location.href = '/';
        } catch (error) {
            alert(error.response?.data || '회원가입 중 오류가 발생했습니다.');
        }
    };
    
    const isButtonDisabled = !nicknameValid;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-20 px-4">
            <div className="w-full max-w-md mx-auto bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-blue-50">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-slate-800 mb-2">추가 정보 입력</h2>
                    <p className="text-slate-500 font-medium">서비스 이용을 위해 추가 정보를 입력해주세요.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-600 ml-1">닉네임</label>
                        <div className="flex gap-2">
                            <div className="relative flex-grow">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    name="nickname"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    placeholder="사용할 닉네임"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="button" onClick={checkNickname} className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl font-bold whitespace-nowrap">중복확인</button>
                        </div>
                        {nicknameMsg && (
                            <p className={`text-xs font-bold ml-1 ${nicknameValid ? 'text-green-500' : 'text-red-500'}`}>{nicknameMsg}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-600 ml-1">전화번호</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                name="phoneNumber"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                placeholder="- 없이 입력"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-600 ml-1">나이</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <select name="age" value={formData.age} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 appearance-none cursor-pointer">
                                <option value="10">10대</option>
                                <option value="20">20대</option>
                                <option value="30">30대</option>
                                <option value="40">40대</option>
                                <option value="50">50대 이상</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-600 ml-1">최애 애니</label>
                        <div className="relative">
                            <Tv className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                name="favoriteAni"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                value={formData.favoriteAni}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isButtonDisabled}
                        className="w-full bg-primary text-white font-black text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0"
                    >
                        가입 완료
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserSocialJoinForm;
