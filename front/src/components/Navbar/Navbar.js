import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo/running_logo.png';
import { useAuth } from '../../context/AuthContext'; // AuthContext 가져오기

import './Navbar.css';

const Navbar = () => {
    const { isLoggedIn, user, logout } = useAuth(); // AuthContext에서 필요한 값과 함수 가져오기

    return (
        <nav className="navbar">
            <Link to="/">
                <img src={logo} alt="Logo" className="logo" />
            </Link>
            <div className="nav-links">
                <Link to="/recruit/list">LIGHTNING</Link>
                <Link to="/crew/incruit">CREW</Link>
                <Link to="/notice/list">NOTICE</Link>
                <Link to="/info/list">INFO</Link>
                <Link to="/free/list">FREE</Link>
                <Link to="/review/list">REVIEW</Link>
                <Link to="/mypage">MyPage</Link>
                
                {/* 로그인 로그아웃 전환 */}
                {isLoggedIn ? (
                    
                    <Link to="#" onClick={logout}>LOGOUT</Link>
                ) : (
                    <>
                        <Link to="/signup">SIGN UP</Link>
                        <Link to="/login">LOGIN</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
