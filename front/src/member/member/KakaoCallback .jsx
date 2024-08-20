import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    console.log("Received code:", code);

    if (code) {
      axios.post('http://localhost:8080/members/kakao/callback', { code })
        .then(response => {
          console.log('Login Success:', response.data);
          navigate('/');
        })
        .catch(error => {
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
