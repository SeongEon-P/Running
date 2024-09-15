import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // AuthContext 가져오기
import { KAKAO_AUTH_URL } from './Kakao';
import './Login.css';
import kakaoImage from '../../assets/img_src/kakao_talk.png'; // 카카오 이미지 가져오기
import logo from '../../assets/logo/running_logo.png'; // 로고 이미지 import

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
  };

  return (
    <div className="login-container">
      <div className="login-title">
        <img src={logo} alt="Logo" className="logo" />
        <h1>로그인</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Email input */}
        <div className="form-outline mb-4">
          <input
            type="text"
            id="mid"
            name="mid"
            className="form-control"
            value={login.mid}
            onChange={handleChange}
            required
          />
          <label className="form-label" htmlFor="mid">아이디</label>
        </div>

        {/* Password input */}
        <div className="form-outline mb-4">
          <input
            type="password"
            id="mpw"
            name="mpw"
            className="form-control"
            value={login.mpw}
            onChange={handleChange}
            required
          />
          <label className="form-label" htmlFor="mpw">비밀번호</label>
        </div>

        {/* Auto login checkbox */}
        <div className="row mb-4">
          <div className="col d-flex justify-content-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="autoLogin"
                checked={autoLogin}
                onChange={handleAutoLoginChange}
              />
              <label className="form-check-label" htmlFor="autoLogin">자동 로그인</label>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        {/* Submit button */}
        <button type="submit" className="btn btn-black btn-block mb-4">로그인</button>

        {/* Links */}
        <div className="col text-center bold-link">
          <Link to="/findId" className="link bold-link">아이디 찾기</Link> |{' '}
          <Link to="/findPassword" className="link bold-link">비밀번호 찾기</Link>
        </div>

        {/* Register and social login */}
        <div className="text-center">
          <p className="bold-link">회원이 아니신가요? <Link to="/signup" className="link bold-link">회원가입</Link></p>
          <div className="social-login">
            <p>다른 방법으로 로그인:</p>
            {/* Kakao login button */}
            <button
              type="button"
              className="kakao-login-btn"
              onClick={kakaoLogin}
              style={{ backgroundImage: `url(${kakaoImage})` }}
            ></button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
