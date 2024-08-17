import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // AuthContext 가져오기

const Login = () => {
  const [login, setLogin] = useState({
    mid: '',
    mpw: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const { login: loginUser } = useAuth(); // AuthContext의 login 함수 사용
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await loginUser(login); // AuthContext의 login 함수 호출
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
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div>
        <Link to="/findId">아이디 찾기</Link> | <Link to="/findPassword">비밀번호 찾기</Link>
      </div>
    </div>
  );
};

export default Login;
