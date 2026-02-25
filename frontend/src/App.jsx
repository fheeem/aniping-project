import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AppRoute from './router/AppRouter';
import AdminRouter from './router/AdminRouter';
import { AdminBoard, AdUserLi, AdminSetting, AdminNotice } from './pages/admin';
import { useState, useEffect } from 'react';
import {
  ChaService,
  ChaRankPage,
  ChaLine,
  ChaCvList,
  ChaCvDetail,
} from './pages/character/chracter';
import ChaPost from './pages/character/ChaPost/ChaPost';
import ChaPostEdit from './pages/character/ChaPost/ChaPostEdit';
import ChaNewPost from './pages/character/ChaPost/ChaNewPost';
import axios from 'axios';
import { AdCuSeAsk, AdFAQ } from './pages/admin/customerservice';
import { AdminAni, AdminAniTag } from './pages/admin/AdminAni';
import { AdminVA } from './pages/admin/AdminVoiceActor';
import { AdminChaFL, AdminChaBoard } from './pages/admin/AdminCha';
import { AdminVALiEd } from './components/admin/AdminVoiceActor'; // AdVaLiEdBtn 제거, AdminVALiEd 사용
import AdminReport from './components/admin/AdminReport';
import { HomePage, AniList, AniDetail, Notice, NoticeDetail, ErrorPage } from './pages'; // ErrorPage 추가
import './App.css';
import ChaPostDetail from './pages/character/ChaPost/ChaPostDetail';
import { UserLogin, UserJoin, UserMyPage } from './pages/user';
import { MyInfo, MyLikes, MyPosts, MyInquiries, MyLines } from './components/user/mypage';
import UserSocialJoinForm from './components/user/UserSocialJoinForm';
import { AdminAniLiEd, AdminAniEdit } from './components/admin/AdminAni';
import { useUser } from './context/UserContext';
import ScrollToTop from './components/common/ScrollToTop';

// Axios 기본 설정
axios.defaults.baseURL = 'http://localhost:8080'; // 백엔드 서버 주소
axios.defaults.withCredentials = true; // 모든 요청에 쿠키를 포함

function App() {
  const { userType } = useUser();
  const [searchLis, setSearchLis] = useState([]);
  // const [posts, setPosts] = useState([]); // 백엔드 API 사용으로 제거

  const handleSavePost = (newPostData) => {
    // 백엔드 API 사용으로 더 이상 사용되지 않음
    console.log("New post saved:", newPostData);
  };
  
  useEffect(() => {
    // 목 데이터 로딩 로직 제거
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/login' element={<UserLogin />} />
        <Route path='/join' element={<UserJoin />} />
        <Route path='/social-join' element={<UserSocialJoinForm />} />

        {userType !== 'admin' && (
          <Route path="/" element={<AppRoute />}>
            <Route index element={<HomePage Data={''} />} />
            <Route path="/list/:category" element={<AniList />} />
            <Route path="/detail/:id" element={<AniDetail />} />
            <Route path="/service" element={<ChaService />} />
            <Route path="/chaRankPage" element={<ChaRankPage />} />
            <Route path="/chaLine" element={<ChaLine />} />
            <Route path="/chaPostEdit/:id" element={<ChaPostEdit />} />
            <Route path="/chaCvList" element={<ChaCvList />} />
            <Route path="/chaCvDetail/:id" element={<ChaCvDetail />} />
            <Route path="/chaPost" element={<ChaPost />} />
            <Route path="/chaNewPost" element={<ChaNewPost />} />
            <Route path="/chaPostDetail/:id" element={<ChaPostDetail />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/notice/:id" element={<NoticeDetail />} />
            
            <Route path="/user" element={<UserMyPage />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<MyInfo />} />
                <Route path="wishlist" element={<MyLikes />} />
                <Route path="posts" element={<MyPosts />} />
                <Route path="lines" element={<MyLines />} />
                <Route path="inquiry" element={<MyInquiries />} />
            </Route>
          </Route>
        )}

        {userType === 'admin' && (
          <Route path="/" element={<AdminRouter />}>
            <Route index element={<AdminBoard />} />
            <Route path="/AdminBoard" element={<AdminBoard />} />
            <Route path="/AdUserLi" element={<AdUserLi />} />
            <Route path="/AdminSetting" element={<AdminSetting />} />
            <Route path="/AdminVA" element={<AdminVA />} />
            <Route path="/AdCuSeAsk" element={<AdCuSeAsk />} />
            <Route path="/AdFAQ" element={<AdFAQ />} />
            {/* AdminVALiEd로 통합 */}
            <Route path="/AdminVALiEd/:id" element={<AdminVALiEd />} />
            <Route path="/Adedit/:id" element={<AdminVALiEd />} />
            <Route path="/AdNew" element={<AdminVALiEd />} />
            
            <Route path="/AdminChaFL" element={<AdminChaFL />} />
            <Route path="/AdminChaBoard" element={<AdminChaBoard />} />
            <Route path="/AdminAni" element={<AdminAni />} />
            <Route path="/AdminAniLiEd/:id" element={<AdminAniLiEd />} />
            <Route path="/AdminAni/edit/:id" element={<AdminAniEdit />} />
            <Route path="/AdminAni/tag" element={<AdminAniTag />} />
            <Route path="/AdminNotice" element={<AdminNotice />} />
            <Route path="/AdminReport" element={<AdminReport />} />
          </Route>
        )}

        {userType !== 'guest' && userType !== 'user' && userType !== 'admin' && (
          <Route path="/" element={<p>정상적이지 않은 접근 입니다.</p>} />
        )}

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
