import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    mid: '',
    mpw: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'USER'
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // 중복 클릭 방지 상태

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // 중복 클릭 방지
    
    setIsSubmitting(true); // 제출 중 상태로 변경
    
    axios
      .post('http://localhost:8080/members/signup', formData)
      .then((response) => {
        alert('회원가입이 완료되었습니다.');
        navigate('/login');
      })
      .catch((error) => {
        console.error('회원가입 에러:', error);
        alert('회원가입에 실패했습니다.');
      })
      .finally(() => {
        setIsSubmitting(false); // 요청 완료 후 제출 상태 초기화
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
        <button type="submit" disabled={isSubmitting}>회원가입</button>
      </form>
    </div>
  );
};

export default Signup;
