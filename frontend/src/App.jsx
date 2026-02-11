axios.defaults.withCredentials = true;
import { BrowserRouter, data, Route, Routes, Navigate } from 'react-router-dom';
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
import { AdminChaFLLiEd } from './components/admin/AdminCha';
import { AdminVALiEd, AdVaLiEdBtn } from './components/admin/AdminVoiceActor';
import { HomePage, AniList, AniDetail, Notice, NoticeDetail, ErrorPage } from './pages'; // ErrorPage 추가
import './App.css';
import ChaPostDetail from './pages/character/ChaPost/ChaPostDetail';
import { UserLogin, UserJoin, UserMyPage } from './pages/user';
import { MyInfo, MyLikes, MyPosts, MyInquiries } from './components/user/mypage';
import { AdminAniLiEd, AdminAniEdit } from './components/admin/AdminAni';
import { useUser } from './context/UserContext';



function App() {
  const { userType } = useUser();
  const [searchLis, setSearchLis] = useState([]);
  const [posts, setPosts] = useState([]);

  const handleSavePost = (newPostData) => {
    const newId =
      posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;
    const newPost = {
      id: newId,
      ...newPostData,
      writer: '새 작성자',
      date: new Date().toISOString().slice(0, 10),
      views: 0,
      likes: 0,
    };
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };
  
  useEffect(() => {
    axios.get('/data/userInfo.json')
      .then(res => setSearchLis(res.data.userInfo))
      .catch(e => console.error('유저 정보 로드 실패:', e));

    axios.get('/data/userPosts.json')
      .then(res => {
        const postsWithWriter = res.data.map(post => ({
          ...post,
          writer: post.writer || '익명'
        }));
        setPosts(postsWithWriter);
      })
      .catch(e => console.error('게시글 정보 로드 실패:', e));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<UserLogin />} />
        <Route path='/join' element={<UserJoin />} />

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
            <Route path="/chaPost" element={<ChaPost posts={posts} />} />
            <Route path="/chaNewPost" element={<ChaNewPost onSavePost={handleSavePost} />} />
            <Route path="/chaPostDetail/:id" element={<ChaPostDetail posts={posts} setPosts={setPosts} />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/notice/:id" element={<NoticeDetail />} /> {/* 공지사항 상세 라우트 추가 */}
            
            <Route path="/user" element={<UserMyPage />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<MyInfo />} />
                <Route path="wishlist" element={<MyLikes />} />
                <Route path="posts" element={<MyPosts />} />
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
            <Route path="/AdminVALiEd/:id" element={<AdminVALiEd />} />
            <Route path="/Adedit/:id" element={<AdVaLiEdBtn />} />
            <Route path="/AdNew" element={<AdVaLiEdBtn />} />
            <Route path="/AdminChaFL" element={<AdminChaFL />} />
            <Route path="/AdminChaBoard" element={<AdminChaBoard />} />
            <Route path="/AdminAni" element={<AdminAni />} />
            <Route path="/AdminAniLiEd/:id" element={<AdminAniLiEd />} />
            <Route path="/AdminAni/edit/:id" element={<AdminAniEdit />} />
            <Route path="/AdminAni/tag" element={<AdminAniTag />} />
            <Route path="/AdminNotice" element={<AdminNotice />} />
          </Route>
        )}

        {userType !== 'guest' && userType !== 'user' && userType !== 'admin' && (
          <Route path="/" element={<p>정상적이지 않은 접근 입니다.</p>} />
        )}

        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
