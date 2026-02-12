import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userType, setUserType] = useState('guest');

  const login = (userData) => {
    setIsLoggedIn(true);
    setUserInfo(userData);
    if (userData.grade) {
      setUserType(userData.grade.toLowerCase());
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8080/api/user/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggedIn(false);
      setUserInfo(null);
      setUserType('guest');
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/me');
        if (response.status === 200 && response.data) {
          login(response.data);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUserInfo(null);
        setUserType('guest');
      }
    };
    checkLoginStatus();
  }, []);

  const value = { isLoggedIn, userInfo, userType, login, logout };

  return (
      <UserContext.Provider value={value}>
        {children}
      </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};