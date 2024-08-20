import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { KAKAO_AUTH_URL } from './Kakao';

const Login = () => {
  const [login, setLogin] = useState({ mid: '', mpw: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const { login: loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await loginUser(login);
      navigate('/');
    } catch (error) {
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
