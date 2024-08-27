import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [logoutTimer, setLogoutTimer] = useState(null); // 로그아웃 타이머 상태

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const userInfo = localStorage.getItem('login') || sessionStorage.getItem('login');

        if (token && userInfo) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userInfo));
            startLogoutTimer(); // 로그인 시 타이머 시작
        }
    }, []);

    const startLogoutTimer = () => {
        // 기존 타이머가 있다면 제거
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }

        // 1시간 후에 로그아웃되도록 타이머 설정
        const timer = setTimeout(() => {
            logout();
        }, 3600000); // 1시간 = 3600000 밀리초

        setLogoutTimer(timer);
    };

    const login = async (credentials, autoLogin) => {
        try {
            const response = await axios.post('http://localhost:8080/members/login', credentials);
            const token = response.data.accessToken;

            if (autoLogin) {
                localStorage.setItem('token', token);
                localStorage.setItem('login', JSON.stringify(credentials));
            } else {
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('login', JSON.stringify(credentials));
            }

            const userInfoResponse = await axios.get('http://localhost:8080/members/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userInfo = {
                mid: userInfoResponse.data.mid,
                name: userInfoResponse.data.name,
                email: userInfoResponse.data.email,
                phone: userInfoResponse.data.phone,
                address: userInfoResponse.data.address,
                role: userInfoResponse.data.role,
            };

            if (autoLogin) {
                localStorage.setItem('login', JSON.stringify(userInfo));
            } else {
                sessionStorage.setItem('login', JSON.stringify(userInfo));
            }

            setIsLoggedIn(true);
            setUser(userInfo);
            startLogoutTimer(); // 로그인 시 타이머 시작
            navigate('/');
        } catch (error) {
            console.error('로그인 에러:', error);
            throw error;
        }
    };

    const loginWithToken = async (token) => {
        try {
            sessionStorage.setItem('token', token);
            const userInfo = JSON.parse(sessionStorage.getItem('login'));
            setIsLoggedIn(true);
            setUser(userInfo);
            startLogoutTimer(); // 로그인 시 타이머 시작
            navigate('/');
        } catch (error) {
            console.error('토큰으로 로그인 실패:', error);
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('login');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('login');
        setIsLoggedIn(false);
        setUser(null);
        clearTimeout(logoutTimer); // 로그아웃 시 타이머 정리
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, loginWithToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
