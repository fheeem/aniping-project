import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Lock, User, Phone, Calendar, Tv, Edit3, Trash2, ImageIcon, X } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const MyInfo = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [messages, setMessages] = useState({});
  const fileInputRef = useRef(null);

  // 모달 상태 관리
  const [modalType, setModalType] = useState(null);
  const [inputPw, setInputPw] = useState('');
  const [newPwData, setNewPwData] = useState({ newPassword: '', confirmNewPassword: '' });
  const [newPwCheck, setNewPwCheck] = useState({ isValid: false, isMatch: false });

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
            age: userData.age || 20,
            favoriteAni: userData.bestAni || ''
          });

          // 프로필 이미지 조회
          axios.get(`/api/files?targetType=PROFILE&targetId=${userData.id}`)
            .then(imgRes => {
              if (imgRes.data && imgRes.data.length > 0) {
                setProfileImage(imgRes.data[0]);
              } else {
                setProfileImage(null);
              }
            })
            .catch(err => console.error("Failed to load profile image", err));
        }
      })
      .catch(err => {
        console.error("Failed to load user data", err);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // 프로필 이미지 업로드/수정
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file && user) {
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

  // 모달 닫기 및 초기화
  const closeModal = () => {
    setModalType(null);
    setInputPw('');
    setNewPwData({ newPassword: '', confirmNewPassword: '' });
    setNewPwCheck({ isValid: false, isMatch: false });
  };

  // 비밀번호 확인 요청
  const handleCheckPassword = () => {
    if (!inputPw) {
        alert("비밀번호를 입력해주세요.");
        return;
    }

    axios.post('/api/user/check-password', { password: inputPw })
        .then(res => {
            if (res.data) {
                if (modalType === 'checkPwForUpdate') {
                    performUpdate();
                } else if (modalType === 'checkPwForChange') {
                    setModalType('newPw');
                    setInputPw('');
                } else if (modalType === 'checkPwForWithdraw') {
                    performWithdraw();
                }
            } else {
                alert("비밀번호가 일치하지 않습니다.");
            }
        })
        .catch(err => alert("비밀번호 확인 중 오류가 발생했습니다."));
  };

  // 정보 수정 실행
  const performUpdate = () => {
    const updateData = {
      nickname: formData.nickname,
      phone: formData.phone,
      age: parseInt(formData.age, 10),
      favoriteAni: formData.favoriteAni,
    };

    axios.put('/api/user/me', updateData)
      .then(res => {
        alert("회원 정보가 성공적으로 수정되었습니다.");
        const updatedUser = res.data;
        setUser(updatedUser);
        setFormData({
            email: updatedUser.email,
            nickname: updatedUser.nickname,
            phone: updatedUser.phoneNumber || '',
            age: updatedUser.age || 20,
            favoriteAni: updatedUser.bestAni || ''
        });
        closeModal();
      })
      .catch(err => {
        const errorMessage = err.response?.data || "정보 수정 중 오류가 발생했습니다.";
        alert(errorMessage);
      });
  };

  // 비밀번호 변경 실행
  const performChangePassword = () => {
    if (!newPwCheck.isValid || !newPwCheck.isMatch) {
        alert("새 비밀번호를 확인해주세요.");
        return;
    }

    axios.post('/api/user/change-password', { newPassword: newPwData.newPassword })
        .then(() => {
            alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
            logout();
            navigate('/login');
        })
        .catch(err => alert("비밀번호 변경 중 오류가 발생했습니다."));
  };

  // 회원 탈퇴 실행
  const performWithdraw = () => {
    if (window.confirm("정말로 탈퇴하시겠습니까? 탈퇴 후에는 복구할 수 없습니다.")) {
        axios.delete('/api/user/me')
            .then(() => {
                alert("회원 탈퇴가 완료되었습니다.");
                logout();
                navigate('/');
            })
            .catch(err => alert("회원 탈퇴 중 오류가 발생했습니다."));
    }
  };

  // 새 비밀번호 유효성 검사
  const handleNewPwChange = (e) => {
    const { name, value } = e.target;
    setNewPwData(prev => {
        const next = { ...prev, [name]: value };
        const pwRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,20}$/;
        const isValid = pwRegex.test(next.newPassword);
        const isMatch = next.newPassword === next.confirmNewPassword;
        setNewPwCheck({ isValid, isMatch });
        return next;
    });
  };

  // 수정 완료 버튼 클릭
  const handleUpdateClick = (e) => {
    e.preventDefault();
    if (!validateNickname()) {
        alert("닉네임을 확인해주세요.");
        return;
    }
    // 소셜 로그인 사용자는 비밀번호 확인 없이 바로 수정
    if (user && user.social !== 'LOCAL') {
        performUpdate();
    } else {
        setModalType('checkPwForUpdate');
    }
  };

  // 비밀번호 변경 버튼 클릭
  const handleChangePwClick = () => {
    setModalType('checkPwForChange');
  };

  // 회원 탈퇴 버튼 클릭
  const handleWithdrawClick = () => {
    // 소셜 로그인 사용자는 비밀번호 확인 없이 바로 탈퇴 (또는 별도 확인 절차)
    // 여기서는 일단 비밀번호 확인 모달을 띄우지 않고 바로 confirm 창으로 이동
    if (user && user.social !== 'LOCAL') {
        performWithdraw();
    } else {
        setModalType('checkPwForWithdraw');
    }
  };

  if (!formData) {
    return <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50 text-center text-slate-500">사용자 정보를 불러오는 중입니다...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
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
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50 relative">
      <h3 className="text-2xl font-black text-slate-800 mb-8 pb-4 border-b border-slate-100">내 정보 수정</h3>
      
      <form onSubmit={handleUpdateClick} className="space-y-8">
        
        {/* 프로필 이미지 섹션 */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32">
            {profileImage && profileImage.fileUrl ? (
              <img 
                key={profileImage.fileUrl}
                src={profileImage.fileUrl} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://via.placeholder.com/128x128?text=Error';
                }}
              />
            ) : (
              <div onClick={() => fileInputRef.current.click()} className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-300 transition-all">
                <ImageIcon className="text-slate-500" size={48} />
              </div>
            )}
            
            {profileImage && profileImage.fileUrl && (
                 <div className="absolute bottom-0 right-0 flex gap-1 z-10">
                 <button type="button" onClick={() => fileInputRef.current.click()} className="bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary-dark transition-all" aria-label="Edit profile image">
                   <Edit3 size={14} />
                 </button>
                 <button type="button" onClick={deleteProfileImage} className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-all" aria-label="Delete profile image">
                   <Trash2 size={14} />
                 </button>
               </div>
            )}
             {!profileImage && (
                <div className="absolute bottom-0 right-0 z-10">
                    <button type="button" onClick={() => fileInputRef.current.click()} className="bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary-dark transition-all">
                        <Edit3 size={14} />
                    </button>
                </div>
             )}

          </div>
          <input type="file" ref={fileInputRef} onChange={handleProfileImageChange} className="hidden" accept="image/*" />
        </div>

        <div>
          <label className={labelClass}>아이디 (이메일)</label>
          <input type="text" value={formData.email} readOnly className={`${inputClass} bg-slate-100 text-slate-500 cursor-not-allowed pl-4`} />
        </div>

        {/* 비밀번호 변경 버튼 (LOCAL 사용자만 표시) */}
        {user && user.social === 'LOCAL' && (
            <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Lock size={16} /> 비밀번호
                </label>
                <button 
                type="button" 
                onClick={handleChangePwClick}
                className="text-xs font-bold text-primary hover:underline"
                >
                비밀번호 변경
                </button>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>닉네임</label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-opacity ${formData.nickname ? 'opacity-0' : 'opacity-100'}`} size={16} />
              <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} onBlur={validateNickname} className={inputClass} />
            </div>
            {messages.nickname && <p className={`text-xs mt-1 ml-1 ${formData.nickname && formData.nickname.length >= 1 && formData.nickname.length <= 20 ? 'text-green-500' : 'text-red-500'}`}>{messages.nickname}</p>}
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

        <div className="flex justify-between pt-4 items-center">
          <button 
            type="button" 
            onClick={handleWithdrawClick}
            className="text-red-500 text-sm font-bold hover:underline"
          >
            회원 탈퇴
          </button>
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            수정 완료
          </button>
        </div>
      </form>

      {/* 모달 컴포넌트 */}
      {modalType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative animate-fadeIn">
                <button 
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <X size={24} />
                </button>
                
                {/* 비밀번호 확인 모달 (수정, 변경, 탈퇴 공통) */}
                {(modalType === 'checkPwForUpdate' || modalType === 'checkPwForChange' || modalType === 'checkPwForWithdraw') && (
                    <>
                        <h4 className="text-lg font-bold text-slate-800 mb-4">
                            {modalType === 'checkPwForWithdraw' ? '회원 탈퇴' : '비밀번호 확인'}
                        </h4>
                        <p className="text-sm text-slate-600 mb-4">
                            {modalType === 'checkPwForWithdraw' 
                                ? '탈퇴하려면 현재 비밀번호를 입력해주세요.' 
                                : '본인 확인을 위해 현재 비밀번호를 입력해주세요.'}
                        </p>
                        <input 
                            type="password" 
                            value={inputPw}
                            onChange={(e) => setInputPw(e.target.value)}
                            placeholder="비밀번호 입력"
                            className={`${inputClass} mb-4`}
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={closeModal} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold">취소</button>
                            <button onClick={handleCheckPassword} className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark">확인</button>
                        </div>
                    </>
                )}

                {/* 새 비밀번호 입력 모달 */}
                {modalType === 'newPw' && (
                    <>
                        <h4 className="text-lg font-bold text-slate-800 mb-4">새 비밀번호 설정</h4>
                        <div className="space-y-4 mb-4">
                            <div>
                                <input 
                                    type="password" 
                                    name="newPassword"
                                    value={newPwData.newPassword}
                                    onChange={handleNewPwChange}
                                    placeholder="새 비밀번호 (영문, 숫자, 특수문자 포함 7~20자)"
                                    className={inputClass}
                                />
                                {!newPwCheck.isValid && newPwData.newPassword && (
                                    <p className="text-xs text-red-500 mt-1 ml-1">비밀번호 형식이 올바르지 않습니다.</p>
                                )}
                            </div>
                            <div>
                                <input 
                                    type="password" 
                                    name="confirmNewPassword"
                                    value={newPwData.confirmNewPassword}
                                    onChange={handleNewPwChange}
                                    placeholder="새 비밀번호 확인"
                                    className={inputClass}
                                />
                                {!newPwCheck.isMatch && newPwData.confirmNewPassword && (
                                    <p className="text-xs text-red-500 mt-1 ml-1">비밀번호가 일치하지 않습니다.</p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={closeModal} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold">취소</button>
                            <button onClick={performChangePassword} className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark">변경하기</button>
                        </div>
                    </>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default MyInfo;
