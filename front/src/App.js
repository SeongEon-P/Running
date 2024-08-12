import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './member/member/Signup';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/members/signup" element={<Signup />} />
          {/* 다른 라우트들 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
