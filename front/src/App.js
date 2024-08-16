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
import NoticeDetail from './notice/NoticeDetail';

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
        <Route path="/notice/list" element={<Noticelist/>}/>
        <Route path="/notice/register" element={<NoticeRegister/>}/>
        <Route path="/notice/:nno" element={<NoticeDetail/>}/>
      </Routes>
    </Router>
  );
};

export default App;