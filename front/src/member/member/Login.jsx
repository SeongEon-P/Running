import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [login, setLogin] = useState({
    mid: '',
    mpw: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8080/members/login', login) // 백엔드의 로그인 URL
      .then((response) => {
        const token = response.data.accessToken;
        localStorage.setItem('token', token); // 또는 sessionStorage.setItem('token', token);
        localStorage.setItem('loginMethod', 'normal'); // 일반 로그인 방법 저장
        alert('로그인에 성공했습니다.');
        navigate('/');
      })
      .catch((error) => {
        console.error('로그인 에러:', error);
        alert('로그인에 실패했습니다.');
      });
  };

  return (
    <div>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <label>
          아이디:
          <input
            type="text"
            name="mid"
            value={login.mid}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          비밀번호:
          <input
            type="password"
            name="mpw"
            value={login.mpw}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default Login;
