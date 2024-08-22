import React, { useState } from 'react';
import './ImageSlider.css';

const images = [
    { src: require('../assets/main/골드트레일 포스터.JPG'), url: 'https://www.goldentrailnationalseries.kr/INFORMATION' },
    { src: require('../assets/main/대관령 포스터.png'), url: 'https://daegwallyeongrun.com/' },
    { src: require('../assets/main/스마일 런 포스터.jpg'), url: 'https://www.smilerun.co.kr/main/main.php' },
    { src: require('../assets/main/포항제철 포스터.jpg'), url: 'https://www.steelrun.kr/front/site/main' },
    { src: require('../assets/main/골드트레일 포스터.JPG'), url: 'https://www.goldentrailnationalseries.kr/INFORMATION' },
];

const ImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 3 ? 0 : prevIndex + 1
        );
    };

    const goToPrev = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 3 : prevIndex - 1
        );
    };

    return (
        <div className="image-slider">
            <div className="slider-wrapper" style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}>
                {images.map((image, index) => (
                    <div className="slider-item" key={index}>
                        <img src={image.src} alt={`Slide ${index}`} className="slider-image" />
                        <div className="image-overlay">
                            <a href={image.url} target="_blank" rel="noopener noreferrer" className="register-button">
                                참가신청
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            <button className="prev-button" onClick={goToPrev}>❮</button>
            <button className="next-button" onClick={goToNext}>❯</button>
            <div className="slider-bar"></div>
        </div>
    );
};

export default ImageSlider;
