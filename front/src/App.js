import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './main/MainPage';
import Navbar from './components/Navbar/Navbar';
import Signup from './member/member/Signup';
import Login from './member/member/Login';
import Update from './member/member/Update';
import MyPage from './member/page/MyPage';

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
      </Routes>
    </Router>
  );
};

export default App;