import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Context 생성
const UserContext = createContext();

// 2. Provider 컴포넌트 생성
export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userType, setUserType] = useState('guest'); // 'guest', 'user', 'admin'

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // withCredentials를 통해 쿠키(세션ID)를 함께 보냄
        const response = await axios.get('/api/user/me', { withCredentials: true });
        if (response.status === 200 && response.data) {
          login(response.data); // 로그인 상태 업데이트
        }
      } catch (error) {
        // 세션이 없거나 만료된 경우 (401 등)
        // 초기 로드 시에는 로그아웃 API를 호출하지 않고 상태만 초기화
        setIsLoggedIn(false);
        setUserInfo(null);
        setUserType('guest');
      }
    };
    checkLoginStatus();
  }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUserInfo(userData);
    // userData.grade가 유효한지 확인 후 toLowerCase 호출
    setUserType(userData.grade ? userData.grade.toLowerCase() : 'user'); // 기본값 'user'
  };

  const logout = async () => {
    try {
      await axios.post('/api/user/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggedIn(false);
      setUserInfo(null);
      setUserType('guest');
      // 로그아웃 후 홈으로 이동 (페이지 새로고침 효과)
      window.location.href = '/';
    }
  };

  const value = { isLoggedIn, userInfo, userType, login, logout };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Custom Hook 생성
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
