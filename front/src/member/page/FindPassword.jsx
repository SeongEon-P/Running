import React, { useState } from 'react';
import axios from 'axios';

const FindPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleFindPassword = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8080/members/find?type=password', { email }) // 여기서 type=password 파라미터를 URL에 추가
      .then((response) => {
        setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
      })
      .catch((error) => {
        console.error('비밀번호 찾기 에러:', error);
        setMessage('비밀번호 재설정 링크 전송에 실패했습니다.');
      });
  };

  return (
    <div>
      <h1>비밀번호 찾기</h1>
      <form onSubmit={handleFindPassword}>
        <label>
          이메일:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

export default FindPassword;
