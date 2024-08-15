import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './main/MainPage';
import Navbar from './components/Navbar/Navbar';
import Signup from './member/member/Signup';
import Login from './member/member/Login';
import Update from './member/member/Update';
import MyPage from './member/page/MyPage';
import NoticeList from './notice/Noticelist';
import NoticeRegister from './notice/NoticeRegister';
import RecruitRegister from './recruit/RecruitRegister';
import RecruitList from './recruit/RecruitList';
import RecruitRead from './recruit/RecruitRead';
import RecruitModify from './recruit/RecruitModify';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/update" element={<Update />} />
        <Route path="/notice/list" element={<NoticeList/>}/>
        <Route path="/notice/Register" element={<NoticeRegister/>}/>
        
        <Route path='/recruitRegister' element={<RecruitRegister/>}/>
        <Route path='/recruit/list' element={<RecruitList/>}/>
        <Route path='/recruit/read/:rno' element={<RecruitRead />} />
        <Route path='/recruit/modify/:rno' element={<RecruitModify />} />
      </Routes>
    </Router>
  );
};

export default App;