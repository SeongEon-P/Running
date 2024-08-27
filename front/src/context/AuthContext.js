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

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('login');

        // 토큰과 사용자 정보가 모두 있는 경우에만 로그인 상태를 유지
        if (token && userInfo) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userInfo));
        } else {
            // 토큰이나 사용자 정보가 없으면 로그아웃 상태로 유지
            setIsLoggedIn(false);
            setUser(null);
        }
        
    }, []); // 빈 배열로 설정하여 컴포넌트가 처음 마운트될 때만 실행

    

    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:8080/members/login', credentials);
            const token = response.data.accessToken;
            localStorage.setItem('token', token);
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
            localStorage.setItem('login', JSON.stringify(userInfo));
            setIsLoggedIn(true);
            setUser(userInfo);
            navigate('/');
        } catch (error) {
            console.error('로그인 에러:', error);
            throw error;
        }
    };

    const loginWithToken = async (token) => {
        try {
            localStorage.setItem('token', token);
            const userInfo = JSON.parse(localStorage.getItem('login'));
            setIsLoggedIn(true);
            setUser(userInfo);
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
        setIsLoggedIn(false);
        setUser(null);
        navigate('/');
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, loginWithToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
