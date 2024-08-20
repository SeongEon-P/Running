import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo/running_logo.png';
import { useAuth } from '../../context/AuthContext'; // AuthContext 가져오기

import './Navbar.css';

const Navbar = () => {
    const { isLoggedIn, logout } = useAuth(); // AuthContext에서 필요한 값과 함수 가져오기

    return (
        <nav className="navbar">
            <Link to="/">
                <img src={logo} alt="Logo" className="logo" />
            </Link>
            <div className="nav-links">
                <Link to="/recruit/list">LIGHTNING</Link>
                <div className="crew-link">
                    <Link to="/crew/incruit">CREW</Link>
                    <div className="dropdown">
                        <Link to="/crew/incruit">CREW 모집</Link>
                        <Link to="/crew/manage">CREW 관리</Link>
                    </div>
                </div>
                <Link to="/notice/list">NOTICE</Link>
                <Link to="/info/list">INFO</Link>
                <Link to="/free/list">FREE</Link>
                <Link to="/review/list">REVIEW</Link>

                <Link to="/mypage">MyPage</Link>
            </div>
            <div className="auth-links">
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
