import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import MainPage from "./main/MainPage";
import Navbar from "./components/Navbar/Navbar";
import FreeBoard from './pages/FreeBoard/FreeBoard';




const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/free/*" element={<FreeBoard />} />
      </Routes>
    </Router>
  );
};

export default App;