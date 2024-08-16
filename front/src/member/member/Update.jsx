import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Update.css';

const Update = () => {
  const [member, setMember] = useState({
    mid: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬 스토리지에서 JWT 토큰 가져오기
    const token = localStorage.getItem('token');

    // JWT 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 로그인한 사용자의 정보 불러오기
    axios
      .get('http://localhost:8080/members/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMember(response.data);
      })
      .catch((error) => {
        console.error('회원 정보 불러오기 실패:', error);
        alert('회원 정보를 불러오지 못했습니다.');
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const handlePasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const checkPassword = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    axios
      .post('http://localhost:8080/members/check-password', {
        mid: member.mid,
        password: currentPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setIsVerified(true);
        alert('비밀번호 확인 성공! 정보를 수정할 수 있습니다.');
      })
      .catch((error) => {
        console.error('비밀번호 확인 실패:', error);
        alert('비밀번호가 일치하지 않습니다.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert('비밀번호 확인 후 수정이 가능합니다.');
      return;
    }
    const token = localStorage.getItem('token');

    axios
      .post('http://localhost:8080/members/update', member, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        alert('회원 정보가 성공적으로 수정되었습니다.');
        navigate('/');
      })
      .catch((error) => {
        console.error('회원 정보 수정 실패:', error);
        alert('회원 정보 수정에 실패했습니다.');
      });
  };

  return (
    <div className="member-update-container">
      <h1 className="member-update-title">회원 정보 수정</h1>
      <form onSubmit={checkPassword}>
        <div className="form-group">
          <label htmlFor="mid">아이디:</label>
          <input type="text" name="mid" value={member.mid} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="currentPassword">비밀번호 확인:</label>
          <input
            type="password"
            name="currentPassword"
            value={currentPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit" className="check-button">비밀번호 확인</button>
      </form>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">이름:</label>
          <input type="text" name="name" value={member.name} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            name="email"
            value={member.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">전화번호:</label>
          <input
            type="text"
            name="phone"
            value={member.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">주소:</label>
          <input
            type="text"
            name="address"
            value={member.address}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button">정보 수정</button>
      </form>
    </div>
  );
};

export default Update;
