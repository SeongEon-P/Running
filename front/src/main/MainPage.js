import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';
import mainImage from '../assets/main/main_pic.png'; 

const MainPage = () => {
    return (
        <div className="main-page">
            <div className="main-image-container">
                <img src={mainImage} alt="Main Visual" className="main-image" />
            </div>
            <div className="main-content">
                <h1>Welcome to Running Club</h1>
                <p>Join us to find running buddies, join a running club, and share information!</p>
                <div className="main-buttons">
                    <Link to="/lightning/list" className="main-button">Find Running Buddies</Link>
                    <Link to="/crew/incruit" className="main-button">Join a Running Club</Link>
                    <Link to="/signup" className="main-button">Sign Up Now</Link>
                </div>
            </div>
        </div>
    );
};

export default MainPage;