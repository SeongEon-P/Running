import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './main/MainPage';
import Navbar from './components/Navbar/Navbar';
import Signup from './member/member/Signup';
import Login from './member/member/Login';
import Update from './member/member/Update';
import MyPage from './member/page/MyPage';
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
import ReviewList from './review/ReviewList';
import ReviewDetail from './review/ReviewDetail';
import ReviewRegister from './review/ReviewRegister';
import InfoList from './info/InfoList';
import InfoRegister from './info/InfoRegister';
import InfoDetail from './info/InfoDetail';

import KakaoCallback from './member/member/KakaoCallback ';
import FreeBoard from './pages/FreeBoard/FreeBoard';
import './App.css';

import KakaoMap from './recruit/sample/KakaoMap';
import Parking from './recruit/parking/Parking';


const App = () => {
  return (
    
    <Router>
      <AuthProvider>

        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/findId" element={<FindId />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          <Route path="/findPassword" element={<FindPassword />} />
          <Route path="/update" element={<Update />} />
          <Route path="/notice/list" element={<Noticelist />} />
          <Route path="/notice/register" element={<NoticeRegister />} />
          <Route path="/notice/detail/:nno" element={<NoticeDetail/>}/>
          <Route path="/notice/:nno" element={<NoticeDetail />} />
          <Route path="/review/:rno" element={<ReviewDetail/>}/>
          <Route path="/review/list" element={<ReviewList/>}/>
          <Route path="/review/register" element={<ReviewRegister/>}/>
          <Route path="/info/:ino" element={<InfoDetail/>}/>
          <Route path="/info/list" element={<InfoList/>}/>
          <Route path="/info/register" element={<InfoRegister/>}/>
          <Route
            path="/login/oauth2/code/kakao" //redirect_url
            element={<KakaoCallback />} //redirect_url에 맞춰 꾸밀 컴포넌트
          />
          <Route path="/free/*" element={<FreeBoard />} />

          <Route path='/recruit/register' element={<RecruitRegister/>}/>
           <Route path='/recruit/list' element={<RecruitList/>}/>
           <Route path='/recruit/read/:rno' element={<RecruitRead />} />
          <Route path='/recruit/modify/:rno' element={<RecruitModify />} />
          <Route path='/map' element={<KakaoMap />} />
          <Route path='/parking' element={<Parking />} />

        </Routes>
      </AuthProvider>
    </Router>
    
  );
};

export default App;