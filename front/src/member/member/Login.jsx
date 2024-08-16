import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
      .post('http://localhost:8080/members/login', login)
      .then((response) => {
        const token = response.data.accessToken;
  
        // JWT 토큰을 로컬 스토리지에 저장
        localStorage.setItem('token', token);
  
        // 토큰을 이용해 사용자 정보 가져오기
        axios
          .get('http://localhost:8080/members/me', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            const userInfo = {
              mid: res.data.mid,
              name: res.data.name,
              email: res.data.email,
              phone: res.data.phone,
              address: res.data.address,
              role: res.data.role,
            };
            console.log('저장할 사용자 정보:', userInfo);
  
            // 사용자 정보를 로컬 스토리지에 JSON 형식으로 저장
            localStorage.setItem('login', JSON.stringify(userInfo));
  
            alert('로그인에 성공했습니다.');
            navigate('/');
          })
          .catch((error) => {
            console.error('사용자 정보 가져오기 에러:', error);
            alert('사용자 정보를 가져오지 못했습니다.');
          });
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
      <div>
        <Link to="/findId">아이디 찾기</Link> | <Link to="/findPassword">비밀번호 찾기</Link>
      </div>
    </div>
  );
};

export default Login;
