import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';

const MyPage = () => {
  const [member, setMember] = useState({
    mid: '',
    name: '',
    phone: '',
    email: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기

    if (token) {
      // 회원 정보를 불러오는 API 호출
      axios.get('http://localhost:8080/members/me', {
        headers: { Authorization: `Bearer ${token}` }, // 인증 헤더에 토큰 추가
      })
      .then(response => {
        setMember(response.data); // 서버에서 받은 사용자 정보를 상태에 저장
      })
      .catch(error => {
        console.error('회원 정보 불러오기 실패:', error);
      });
    } else {
      console.error('토큰이 없습니다. 로그인해 주세요.');
    }
  }, []);

  const handleDeleteAccount = () => {
    const token = localStorage.getItem('token'); // 토큰 가져오기

    if (window.confirm('정말로 탈퇴하시겠습니까?')) {
      axios.delete('http://localhost:8080/members/delete', {
        headers: { Authorization: `Bearer ${token}` }, // 인증 헤더에 토큰 추가
      })
      .then(() => {
        alert('회원탈퇴가 완료되었습니다.');
        localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거
        localStorage.removeItem('login'); // 로컬 스토리지에서 사용자 정보 제거
        navigate('/'); // 메인 페이지로 리다이렉트
      })
      .catch(error => {
        console.error('회원 탈퇴 실패:', error);
        alert('회원 탈퇴에 실패했습니다.');
      });
    }
  };

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
        </tbody>
        <button className="delete-account-button" onClick={handleDeleteAccount}>
        회원탈퇴
      </button>
      </table>
      
    </div>
  );
};

export default MyPage;
