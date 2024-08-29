import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    // 회원 정보를 불러오는 API 호출
    axios.get('http://localhost:8080/members/login')
      .then(response => {
        setMember(response.data);
      })
      .catch(error => {
        console.error('회원 정보 불러오기 실패:', error);
      });
  }, []);

  const handleDeleteAccount = () => {
    const token = localStorage.getItem('token');

    if (window.confirm('정말로 탈퇴하시겠습니까?')) {
      axios.delete('http://localhost:8080/members/delete', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          alert('회원탈퇴가 완료되었습니다.');
          localStorage.removeItem('token');
          localStorage.removeItem('login');
          navigate('/');
        })
        .catch(error => {
          console.error('회원 탈퇴 실패:', error);
          alert('회원 탈퇴에 실패했습니다.');
        });
    }
  };

  const handleTeamManageClick = () => {
    const loginData = JSON.parse(localStorage.getItem('login'));
    const userName = loginData?.name;

    if (member.role === 'LEADER' && userName) {
      navigate(`/team/view/${encodeURIComponent(userName)}`);
    } else if (!userName) {
      console.error('사용자 이름이 설정되지 않았습니다.');
    } else {
      alert("팀 관리 권한이 없습니다.");
    }
  };

  const handleMyTeamClick = () => {
    const loginData = JSON.parse(localStorage.getItem('login'));
    const userName = loginData?.name;

    if (member.role === 'USER' && userName) {
      navigate(`/team/view2/${encodeURIComponent(userName)}`);
    } else {
      alert("팀 정보 확인 권한이 없습니다.");
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
          {member.role === 'ADMIN' && (
            <li><a href="/admin">관리자 페이지</a></li>
          )}
          {member.role === 'LEADER' && (
            <li><a href="#" onClick={handleTeamManageClick}>팀 관리</a></li>
          )}
          {member.role === 'USER' && (
            <li><a href="#" onClick={handleMyTeamClick}>나의 팀</a></li>
          )}
        </ul>
      </nav>
      <hr />
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
          <tr>
            <td className="mypage-table-label">등급</td>
            <td className="mypage-table-value">
              {JSON.parse(localStorage.getItem('login'))?.role}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MyPage;
