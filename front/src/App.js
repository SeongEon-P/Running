import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import TeamRegister from './teammanage/TeamRegister';
import TeamList from './teammanage/TeamList';
import TeamView from './teammanage/TeamView';
import TeamView2 from './teammanage/TeamView2';
import TeamView3 from './teammanage/TeamView3';
import TeamEdit from './teammanage/TeamEdit';

import IncruitRegister from './incruit/IncruitRegister';
import IncruitList from './incruit/IncruitList';
import IncruitView from './incruit/IncruitView';
import IncruitEdit from './incruit/IncruitEdit';

import MainPage from './main/MainPage';
import Navbar from './components/Navbar/Navbar';
import Signup from './member/member/Signup';
import Login from './member/member/Login';
import Update from './member/member/Update';
import MyPage from './member/page/MyPage';
import AdminPage from './member/page/AdminPage';

import NoticeRegister from './notice/NoticeRegister';
import Noticelist from './notice/Noticelist';
import RecruitRegister from './recruit/RecruitRegister';
import RecruitList from './recruit/RecruitList';
import RecruitRead from './recruit/RecruitRead';
import RecruitModify from './recruit/RecruitModify';
import NoticeDetail from './notice/NoticeDetail';

import FindId from './member/page/FindId';
import FindPassword from './member/page/FindPassword';
import ResetPassword from './member/page/ResetPassword';
import { AuthProvider } from './context/AuthContext';

import KakaoCallback from './member/member/KakaoCallback ';
import FreeBoard from './pages/FreeBoard/FreeBoard';
import './App.css';

import KakaoMap from './recruit/sample/KakaoMap';


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/team/register" element={<TeamRegister />} />
          <Route path="/team/list" element={<TeamList />} />
          <Route path="/team/:teamName" element={<TeamView3 />} />

          <Route path="/incruit/register" element={<IncruitRegister />} />
          <Route path="/incruit/list" element={<IncruitList />} />
          <Route path="/incruit/:ino" element={<IncruitView />} />
          <Route path="/incruit/edit/:ino" element={<IncruitEdit />} />

          <Route path="/" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/team/view/:teamLeader" element={<TeamView />} />
          <Route path="/team/view2/:teamMembers" element={<TeamView2 />} />
          <Route path="/team/edit/:teamName" element={<TeamEdit />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path='/findId' element={<FindId />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          <Route path='/findPassword' element={<FindPassword />} />
          <Route path="/update" element={<Update />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="/login/oauth2/code/kakao" //redirect_url
            element={<KakaoCallback />} //당신이 redirect_url에 맞춰 꾸밀 컴포넌트
          />

          <Route path="/notice/list" element={<Noticelist />} />
          <Route path="/notice/register" element={<NoticeRegister />} />
          <Route path="/notice/:nno" element={<NoticeDetail />} />



          <Route path="/free/*" element={<FreeBoard />} />

          <Route path='/recruit/register' element={<RecruitRegister/>}/>
           <Route path='/recruit/list' element={<RecruitList/>}/>
           <Route path='/recruit/read/:rno' element={<RecruitRead />} />
          <Route path='/recruit/modify/:rno' element={<RecruitModify />} />
          <Route path='/map' element={<KakaoMap />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;