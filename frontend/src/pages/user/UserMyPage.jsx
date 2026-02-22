import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import UserSidebar from '../../components/user/mypage/UserSidebar';

const UserMyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 현재 경로에서 탭 이름 추출 (예: /user/wishlist -> wishlist)
  // /user로 접속 시 profile로 리다이렉트하는 로직은 App.jsx의 <Navigate>가 처리하지만,
  // 여기서도 activeTab을 결정하기 위해 필요함.
  const currentPath = location.pathname.split('/').pop();
  
  // 사이드바에서 사용할 activeTab 값 매핑
  // URL 경로와 사이드바의 탭 ID가 다를 경우 매핑 필요
  // App.jsx의 라우트: profile, wishlist, posts, inquiry
  // UserSidebar의 탭 ID: info, likes, posts, lines, inquiry (추정)
  
  let activeTab = 'info';
  if (currentPath === 'profile') activeTab = 'info';
  else if (currentPath === 'wishlist') activeTab = 'likes';
  else if (currentPath === 'posts') activeTab = 'posts';
  else if (currentPath === 'lines') activeTab = 'lines';
  else if (currentPath === 'inquiry') activeTab = 'inquiry';

  // 사이드바에서 탭 변경 시 URL 이동 함수
  const handleTabChange = (tabId) => {
    switch (tabId) {
      case 'info':
        navigate('/user/profile');
        break;
      case 'likes':
        navigate('/user/wishlist');
        break;
      case 'posts':
        navigate('/user/posts');
        break;
      case 'lines':
        navigate('/user/lines'); // 라우트가 없다면 추가 필요
        break;
      case 'inquiry':
        navigate('/user/inquiry');
        break;
      default:
        navigate('/user/profile');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-12">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-8 items-start">
        {/* setActiveTab 대신 handleTabChange를 전달하여 URL 변경 유도 */}
        <UserSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        <main className="flex-1 w-full">
          {/* 자식 라우트 컴포넌트가 여기에 렌더링됨 */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserMyPage;
