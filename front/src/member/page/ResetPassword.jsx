import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { token } = useParams(); // URL 경로 파라미터에서 token을 가져옵니다.

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    axios
      .post('http://localhost:8080/members/reset-password', {
        token,
        newPassword,
      })
      .then((response) => {
        setMessage('비밀번호가 성공적으로 재설정되었습니다.');
        navigate('/login'); // 비밀번호 재설정 후 로그인 페이지로 이동
      })
      .catch((error) => {
        console.error('비밀번호 재설정 에러:', error);
        setMessage('비밀번호 재설정에 실패했습니다.');
      });
  };

  return (
    <div>
      <h1>비밀번호 재설정</h1>
      <form onSubmit={handleResetPassword}>
        <label>
          새 비밀번호:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          비밀번호 확인:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">비밀번호 재설정</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
