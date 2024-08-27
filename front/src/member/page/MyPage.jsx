import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPage.css'; // 분리된 CSS 파일을 가져옵니다

const MyPage = () => {
  const [member, setMember] = useState({
    mid: '',
    name: '',
    phone: '',
    email: '',
    introduction: ''
  });

  useEffect(() => {
    // 회원 정보를 불러오는 API 호출
    axios.get('http://localhost:8080/members/me', { // 'me' 엔드포인트를 사용하여 회원 정보를 불러옴
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } // 토큰을 헤더에 포함
    })
      .then(response => {
        setMember(response.data);
      })
      .catch(error => {
        console.error('회원 정보 불러오기 실패:', error);
      });
  }, []);

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">My Page</h1>
      <nav className="mypage-nav">
        <ul>
          <li><a href="#">내가 쓴 글</a></li>
          <li><a href="#">내가 공감한 글</a></li>
          <li><a href="/update">내 정보 변경</a></li>
        </ul>
      </nav><hr />
      <h2 className="mypage-about-title">ABOUT ME</h2>
      <table className="mypage-table">
        <tbody>
          <tr>
            <td className="mypage-table-label">ID</td>
            <td className="mypage-table-value">{member.mid}</td>
          </tr>
          <tr>
            <td className="mypage-table-label">이름</td>
            <td className="mypage-table-value">{member.name}</td>
          </tr>
          <tr>
            <td className="mypage-table-label">연락처</td>
            <td className="mypage-table-value">{member.phone}</td>
          </tr>
          <tr>
            <td className="mypage-table-label">Email</td>
            <td className="mypage-table-value">{member.email}</td>
          </tr>
          <tr>
            <td className="mypage-table-label">소개</td>
            <td className="mypage-table-value">{member.introduction}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MyPage;
