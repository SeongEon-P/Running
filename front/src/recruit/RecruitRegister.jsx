import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import DaumPostcode from 'react-daum-postcode';
import './RecruitRegister.css';

const RecruitRegister = () => {
    const [recruit, setRecruit] = useState({
        title: '',
        content:'',
        address: '',
        place: '',
        date: '',
        time: '',
        maxnumber:'',
        mid: ''
    });
    const [openPostcode, setOpenPostcode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('login'));
        if(userInfo && userInfo.mid) {
            setRecruit((prevState) => ({
                ...prevState,
                mid: userInfo.mid
            }))
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecruit({
            ...recruit,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:8080/recruit', recruit);
            console.log(response.data);
            alert('모집글이 정상적으로 등록되었습니다.');
            navigate('/recruit/list')
        } catch (error) {
            console.error('---------------- 모집 게시글 등록 중 오류 발생 : ', error);
            alert('알 수 없는 이유로 모집글이 등록되지 않았습니다.');
        }
    };

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';
    
        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress +=
              extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
          }
          fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }
    
        setRecruit({ ...recruit, address: fullAddress });
        setOpenPostcode(false); // 주소 선택 후 모달 닫기
      };
    


      return (
        <div className="recruitRegister-container">
            <h1 className="recruitRegister-title">Register Recruit</h1>
    
            <form onSubmit={handleSubmit} className="recruitRegister-form">
                <div className="recruitRegister-form-group">
                    <label className="recruitRegister-form-label">제목: </label>
                    <input
                        type="text"
                        name="title"
                        value={recruit.title}
                        onChange={handleChange}
                        required
                        className="recruitRegister-form-input"
                    />
                </div>
                <div className="recruitRegister-form-group">
                    <label className="form-label">내용: </label>
                    <textarea
                        name="content"
                        value={recruit.content}
                        onChange={handleChange}
                        required
                        className="recruitRegister-form-textarea"
                    />
                </div>
                <div className="recruitRegister-form-group">
                    <label className="recruitRegister-form-label">모이는 장소: </label>
                    <input
                        type="text"
                        name="place"
                        value={recruit.place}
                        onChange={handleChange}
                        required
                        className="recruitRegister-form-input"
                    />
                    <p className="recruitRegister-form-hint">러너들이 찾기 쉽도록 특정 건물이나 건축물을 명시해주시면 더 좋아요!</p>
                </div>
                <div className="recruitRegister-form-group">
                    <label className="recruitRegister-form-label">상세 주소: </label>
                    <input
                        type="text"
                        name="address"
                        value={recruit.address}
                        onChange={handleChange}
                        readOnly
                        className="recruitRegister-form-input"
                    />
                    <button 
                        type="button" 
                        onClick={() => setOpenPostcode(true)} 
                        className="recruitRegister-address-search-button"
                    >
                        주소 검색
                    </button>
                </div>
                <div className="recruitRegister-form-group">
                    <label className="recruitRegister-form-label">모이는 날짜: </label>
                    <input
                        type="date"
                        name="date"
                        value={recruit.date}
                        onChange={handleChange}
                        required
                        className="recruitRegister-form-input"
                    />
                </div>
                <div className="recruitRegister-form-group">
                    <label className="recruitRegister-form-label">모이는 시간: </label>
                    <input
                        type="time"
                        name="time"
                        value={recruit.time}
                        onChange={handleChange}
                        required
                        className="recruitRegister-form-input"
                    />
                </div>
                <div className="recruitRegister-form-group">
                    <label className="recruitRegister-form-label">모집 인원: </label>
                    <input
                        type="number"
                        name="maxnumber"
                        value={recruit.maxnumber}
                        onChange={handleChange}
                        required
                        className="recruitRegister-form-input"
                    />
                </div>
                <div className="recruitRegister-form-group">
                    <label className="recruitRegister-form-label">Member ID: </label>
                    <input
                        type="text"
                        name="mid"
                        value={recruit.mid}
                        readOnly
                        className="recruitRegister-form-input"
                    />
                </div>
                <button 
                    type="button" 
                    onClick={handleSubmit} 
                    className="recruitRegister-submit-button"
                >
                    Register
                </button>
            </form>
    
            {openPostcode && (
                <div className="recruitRegister-modal">
                    <div className="recruitRegister-modal-content">
                        <span
                            className="recruitRegister-modal-close"
                            onClick={() => setOpenPostcode(false)}
                        >
                            &times;
                        </span>
                        <DaumPostcode onComplete={handleComplete} />
                    </div>
                </div>
            )}
        </div>
    )
    
}

export default RecruitRegister;