import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Lock, User, Phone, Calendar, Tv, Edit3, Trash2, ImageIcon } from 'lucide-react';

const MyInfo = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  // 데이터 로딩 함수
  const fetchUserData = () => {
    axios.get('/api/user/me')
      .then(res => {
        if (res.data) {
          const userData = res.data;
          setUser(userData);
          setFormData({
            email: userData.email,
            nickname: userData.nickname,
            phone: userData.phoneNumber || '',
            age: userData.age || 20, // DB 기본값이 없으므로 프론트에서 기본값 설정
            favoriteAni: userData.bestAni || ''
          });

          // 프로필 이미지 조회
          axios.get(`/api/files?targetType=PROFILE&targetId=${userData.id}`)
            .then(imgRes => {
              setProfileImage(imgRes.data && imgRes.data.length > 0 ? imgRes.data[0] : null);
            })
            .catch(err => console.error("Failed to load profile image", err));
        }
      })
      .catch(err => {
        console.error("Failed to load user data", err);
        // 인증 오류 시 로그인 페이지로 리디렉션 등을 고려할 수 있음
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // 프로필 이미지 업로드/수정
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file && user) {
      // 기존 프로필 이미지가 있으면 삭제
      const deleteOldImage = profileImage 
        ? axios.delete(`/api/files/${profileImage.id}`) 
        : Promise.resolve();

      deleteOldImage.then(() => {
        const uploadFormData = new FormData();
        uploadFormData.append('targetType', 'PROFILE');
        uploadFormData.append('targetId', user.id);
        uploadFormData.append('files', file);

        axios.post('/api/files/upload', uploadFormData, { headers: { 'Content-Type': 'multipart/form-data' } })
          .then(res => {
            if (res.data && res.data.length > 0) {
              setProfileImage(res.data[0]);
              alert("프로필 이미지가 변경되었습니다.");
            }
          })
          .catch(err => alert("이미지 업로드에 실패했습니다."));
      }).catch(err => alert("기존 이미지 삭제에 실패했습니다."));
    }
  };

  // 프로필 이미지 삭제
  const deleteProfileImage = () => {
    if (!profileImage) return;
    axios.delete(`/api/files/${profileImage.id}`)
      .then(() => {
        alert("프로필 이미지가 삭제되었습니다.");
        setProfileImage(null);
      })
      .catch(err => alert("이미지 삭제에 실패했습니다."));
  };

  // 폼 제출 (정보 수정)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updateData = {
      nickname: formData.nickname,
      phone: formData.phone,
      age: parseInt(formData.age, 10), // select 값은 문자열이므로 숫자로 변환
      favoriteAni: formData.favoriteAni,
    };

    axios.put('/api/user/me', updateData)
      .then(res => {
        alert("회원 정보가 성공적으로 수정되었습니다.");
        // 수정된 정보로 상태 업데이트
        const updatedUser = res.data;
        setUser(updatedUser);
        setFormData({
            email: updatedUser.email,
            nickname: updatedUser.nickname,
            phone: updatedUser.phoneNumber || '',
            age: updatedUser.age || 20,
            favoriteAni: updatedUser.bestAni || ''
        });
      })
      .catch(err => {
        const errorMessage = err.response?.data || "정보 수정 중 오류가 발생했습니다.";
        alert(errorMessage);
      });
  };

  if (!formData) {
    return <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50 text-center text-slate-500">사용자 정보를 불러오는 중입니다...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 이모지를 포함한 닉네임 유효성 검사
  const validateNickname = () => {
    if (!formData.nickname || formData.nickname.length > 20 || formData.nickname.length < 1) {
        setMessages(prev => ({ ...prev, nickname: '닉네임은 1~20자 이내로 입력해주세요.' }));
        return false;
    }
    setMessages(prev => ({ ...prev, nickname: '사용 가능한 닉네임입니다.' }));
    return true;
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-700 placeholder:text-slate-400 text-sm";
  const labelClass = "block text-sm font-bold text-slate-600 mb-1 ml-1";

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50">
      <h3 className="text-2xl font-black text-slate-800 mb-8 pb-4 border-b border-slate-100">내 정보 수정</h3>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32">
            {profileImage ? (
              <img src={profileImage.fileUrl} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-white shadow-md" />
            ) : (
              <div onClick={() => fileInputRef.current.click()} className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-300 transition-all">
                <ImageIcon className="text-slate-500" size={48} />
              </div>
            )}
            <div className="absolute bottom-0 right-0 flex gap-1">
              <button type="button" onClick={() => fileInputRef.current.click()} className="bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary-dark transition-all" aria-label="Upload or edit profile image">
                <Edit3 size={14} />
              </button>
              {profileImage && (
                <button type="button" onClick={deleteProfileImage} className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-all" aria-label="Delete profile image">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleProfileImageChange} className="hidden" accept="image/*" />
        </div>

        <div>
          <label className={labelClass}>아이디 (이메일)</label>
          <input type="text" value={formData.email} readOnly className={`${inputClass} bg-slate-100 text-slate-500 cursor-not-allowed pl-4`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>닉네임</label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-opacity ${formData.nickname ? 'opacity-0' : 'opacity-100'}`} size={16} />
              <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} onBlur={validateNickname} className={inputClass} />
            </div>
            {messages.nickname && <p className={`text-xs mt-1 ml-1 ${validateNickname() ? 'text-green-500' : 'text-red-500'}`}>{messages.nickname}</p>}
          </div>

          <div>
            <label className={labelClass}>전화번호</label>
            <div className="relative">
              <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-opacity ${formData.phone ? 'opacity-0' : 'opacity-100'}`} size={16} />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="-없이 입력" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>나이</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <select name="age" value={formData.age} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`}>
                <option value={10}>10대</option>
                <option value={20}>20대</option>
                <option value={30}>30대</option>
                <option value={40}>40대</option>
                <option value={50}>50대 이상</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>최애 애니</label>
            <div className="relative">
              <Tv className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-opacity ${formData.favoriteAni ? 'opacity-0' : 'opacity-100'}`} size={16} />
              <input type="text" name="favoriteAni" value={formData.favoriteAni} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyInfo;
