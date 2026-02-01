import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Context 생성
const UserContext = createContext();

// 2. Provider 컴포넌트 생성
export const UserProvider = ({ children }) => {
  // localStorage에서 초기값을 읽어오거나, 없으면 'guest'로 설정
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem('userType') || 'guest';
  });

  // userType이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('userType', userType);
  }, [userType]);

  return (
    <UserContext.Provider value={{ userType, setUserType }}>
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
