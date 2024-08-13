import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './member/member/Signup';
import Login from './member/member/Login';
import Update from './member/member/Update';
import MyPage from './member/page/MyPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/update" element={<Update />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
