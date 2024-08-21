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
        if (token && userInfo) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userInfo));
        }
    }, []);

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
            setIsLoggedIn(true);
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
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, loginWithToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
