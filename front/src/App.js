import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './member/member/Signup';
import Login from './member/member/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/members/signup" element={<Signup />} />
          <Route path="/members/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
