import React, { useState } from 'react';
import axios from 'axios';

const FindId = () => {
  const [email, setEmail] = useState('');
  const [foundId, setFoundId] = useState(null);

  const handleFindId = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8080/members/find?type=id', { email })  // 여기서 type=id 파라미터를 URL에 추가
      .then((response) => {
        setFoundId(response.data.mid); // 서버에서 받은 아이디를 저장
      })
      .catch((error) => {
        console.error('아이디 찾기 에러:', error);
        alert('아이디를 찾을 수 없습니다.');
      });
  };

  return (
    <div>
      <h1>아이디 찾기</h1>
      <form onSubmit={handleFindId}>
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
        <button type="submit">아이디 찾기</button>
      </form>
      {foundId && <p>회원님의 아이디는 {foundId} 입니다.</p>}
    </div>
  );
};

export default FindId;
