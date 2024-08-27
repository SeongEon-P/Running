import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // AuthContext 가져오기

const KakaoCallback = () => {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      axios
        .post('http://localhost:8080/members/kakao/callback', { code })
        .then((response) => {
          const token = response.data.accessToken;

          if (token) {
            // 로컬 스토리지에 토큰 저장
            sessionStorage.setItem('token', token);

            console.log("토큰을 성공적으로 받았습니다:", token);

            // AuthContext를 통해 로그인 상태 업데이트
            loginWithToken(token)
              .then(() => {
                // 홈으로 이동
                navigate('/');
              })
              .catch((error) => {
                console.error('로그인 상태 업데이트 실패:', error);
                navigate('/login');
              });
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
