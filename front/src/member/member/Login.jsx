import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // AuthContext 가져오기
import { KAKAO_AUTH_URL } from './Kakao';
import axios from 'axios';

const Login = () => {
  const [login, setLogin] = useState({
    mid: '',
    mpw: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [autoLogin, setAutoLogin] = useState(false); // 자동 로그인 체크박스 상태

  const { login: loginUser } = useAuth(); // AuthContext의 login 함수 사용
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleAutoLoginChange = (e) => {
    setAutoLogin(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await loginUser(login, autoLogin); // AuthContext의 login 함수 호출, autoLogin 전달
      navigate('/'); // 로그인 성공 시 홈으로 이동
    } catch (error) {
      // 에러 처리
      if (error.response && error.response.status === 404) {
        setErrorMessage('등록된 아이디가 없습니다.');
      } else if (error.response && error.response.status === 401) {
        setErrorMessage('비밀번호가 틀렸습니다.');
      } else {
        setErrorMessage('로그인에 실패했습니다.');
      }
    }
  };

  const kakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  }

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
        <label>
          <input
            type="checkbox"
            checked={autoLogin}
            onChange={handleAutoLoginChange}
          />
          자동 로그인
        </label>
        <br />
        <button type="submit">로그인</button>
      </form>
      <button onClick={kakaoLogin}>카카오 로그인</button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div>
        <Link to="/findId">아이디 찾기</Link> |{' '}
        <Link to="/findPassword">비밀번호 찾기</Link>
      </div>
    </div>
  );
};

export default Login;
