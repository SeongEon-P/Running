import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // 인가 코드를 서버로 전송하여 액세스 토큰 요청
      axios.post('http://localhost:8080/members/kakao/callback', { code })
        .then(response => {
          // 성공적으로 로그인한 경우
          console.log('Login Success:', response.data);
          // JWT 토큰이나 사용자 정보를 저장하고 홈으로 이동
          navigate('/');
        })
        .catch(error => {
          // 에러 처리
          console.error('Login Failed:', error);
          navigate('/login');
        });
    } else {
      console.error('Authorization code not found');
      navigate('/login');
    }
  }, [navigate]);

  return <div>카카오 로그인 중...</div>;
};

export default KakaoCallback;
