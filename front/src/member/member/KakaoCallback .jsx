import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // AuthContext 가져오기

const KakaoCallback = () => {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    console.log('useEffect 실행됨');
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log('추출된 인가 코드:', code); // 이 로그가 찍히는지 확인

    if (code) {
      axios
        .post('http://localhost:8080/members/kakao/callback', { code })
        .then((response) => {
          console.log('인가 코드:', code); // 인가 코드가 제대로 추출되었는지 확인
          console.log('서버 응답:', response.data); // 서버 응답을 콘솔에 출력

          const token = response.data.accessToken;

          if (token) {
            console.log('받은 토큰:', token); // 받은 토큰을 콘솔에 출력

            // 로컬 스토리지에 토큰 저장
            localStorage.setItem('token', token);

            // 로컬 스토리지에서 토큰이 저장되었는지 확인
            const storedToken = localStorage.getItem('token');
            console.log('저장된 토큰:', storedToken);

            // AuthContext를 통해 로그인 상태 업데이트
            loginWithToken(token);

            // 홈으로 이동
            navigate('/');
          } else {
            console.error('토큰이 없습니다.');
            navigate('/login');
          }
        })
        .catch((error) => {
          console.error('토큰 요청 실패:', error);
          navigate('/login');
        });
    } else {
      console.error('인가 코드가 없습니다.');
      navigate('/login');
    }
  }, [navigate, loginWithToken]);

  return <div>카카오 로그인 중...</div>;
};

export default KakaoCallback;
