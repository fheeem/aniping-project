import React, { useState, useEffect } from 'react'; // useEffect 추가
import UserSidebar from '../../components/user/mypage/UserSidebar';
import MyInfo from '../../components/user/mypage/MyInfo';
import MyLikes from '../../components/user/mypage/MyLikes';
import MyPosts from '../../components/user/mypage/MyPosts';
import MyLines from '../../components/user/mypage/MyLines';
import MyInquiries from '../../components/user/mypage/MyInquiries';

const UserMyPage = () => {
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    console.log('UserMyPage: activeTab changed to', activeTab);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return <MyInfo />;
      case 'likes':
        return <MyLikes />;
      case 'posts':
        return <MyPosts />;
      case 'lines':
        return <MyLines />;
      case 'inquiry':
        return <MyInquiries />;
      default:
        return <MyInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-12">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-8 items-start">
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default UserMyPage;
