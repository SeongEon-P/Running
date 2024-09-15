import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';
import mainImage from '../assets/main/main_pic.png'; 
import qrImage from '../assets/main/QR.png'; 
import ImageSlider from './ImageSlider';

const MainPage = () => {
    return (
        <div className="main-page">
            <div className="main-image-container">
                <img src={mainImage} alt="Main Visual" className="main-image" />
            </div>
           
            <div className="main-content">
                <h1>Let's run with People!</h1>
                <p>함께 뛸 때, 더 재미있게, 더 멀리 뛸 수 있습니다!</p>
                <img src={qrImage} className="qr-image" />
                <p className="github-text">gitHub 가기</p>
                <h3 className="ImageSlider-title">Marathon Now</h3>
                <ImageSlider />
                <div className="main-buttons">
                    <Link to="/recruit/list" className="main-button">Find Running Buddies</Link>
                    <Link to="/crew/incruit" className="main-button">Join a Running Club</Link>
                    <Link to="/signup" className="main-button">Sign Up Now</Link>
                </div>
            </div>
        </div>
    );
};

export default MainPage;