import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    mid: '',
    mpw: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8080/members/signup', formData) // 백엔드 URL로 수정
      .then((response) => {
        alert('회원가입이 완료되었습니다.');
        // 성공 후 동작 (예: 로그인 페이지로 리다이렉션)
      })
      .catch((error) => {
        console.error('회원가입 에러:', error); // 에러 메시지 확인
        alert('회원가입에 실패했습니다.');
        // 오류 처리
      });
  };

  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <label>
          아이디:
          <input
            type="text"
            name="mid"
            value={formData.mid}
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
            value={formData.mpw}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          이름:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          이메일:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          전화번호:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          주소:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Signup;
