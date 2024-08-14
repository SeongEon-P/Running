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
        const token = response.data.accessToken; // 서버로부터 받은 JWT 토큰
        const userInfo = {
          mid: response.data.mid,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          role: response.data.role,
        };
        console.log('저장할 사용자 정보:', userInfo);

        // 로컬 스토리지에 JWT 토큰과 회원 정보를 저장
        localStorage.setItem('token', token); // JWT 토큰 저장
        localStorage.setItem('login', JSON.stringify(userInfo)); // 회원 정보를 JSON 형식으로 저장

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
