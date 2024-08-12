import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [login, setLogin] = useState({
    mid: '',
    mpw: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8080/members/login', login) // 백엔드의 로그인 URL로 수정
      .then((response) => {
        alert('로그인에 성공했습니다.');
        // 성공 후 동작 (예: 메인 페이지로 리다이렉션)
        // 예를 들어: window.location.href = '/main';
      })
      .catch((error) => {
        console.error('로그인 에러:', error); // 에러 메시지 확인
        alert('로그인에 실패했습니다.');
        // 오류 처리
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
