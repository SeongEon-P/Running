import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo/running_logo.png';

import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <img src={logo} alt="Logo" className="logo" />
            </Link>
            <div className="nav-links">
                <Link to="/lightning/list">LIGHTNING</Link>
                <Link to="/crew/incruit">CREW</Link>
                <Link to="/notice/list">NOTICE</Link>
                <Link to="/info/list">INFO</Link>
                <Link to="/free/list">FREE</Link>
                <Link to="/review/list">REVIEW</Link>
                <Link to="/signup">SIGN UP</Link>
                <Link to="/login">LOGIN</Link>
            </div>
        </nav>
    );
};

export default Navbar;
