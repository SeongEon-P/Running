import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import DaumPostcode from 'react-daum-postcode';
import './RecruitRegister.css';

const RecruitModify = () => {
    const { rno } = useParams();
    const [recruit, setRecruit] = useState({
        rno: '',
        title: '',
        content: '',
        address: '',
        place: '',
        date: '',
        time: '',
        maxnumber: '',
        mid: ''
    });
    const [openPostcode, setOpenPostcode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/recruit/read', { params: { rno } })
            .then(response => {
                const data = response.data;
                setRecruit({
                    rno: data.rno,
                    title: data.title,
                    content: data.content,
                    address: data.address,
                    place: data.place,
                    date: `${data.date[0]}-${String(data.date[1]).padStart(2, '0')}-${String(data.date[2]).padStart(2, '0')}`, // 배열을 'yyyy-MM-dd' 형식의 문자열로 변환
                    time: data.time.slice(0, 2).map(num => String(num).padStart(2, '0')).join(':'), // 배열을 'hh:mm' 형식의 문자열로 변환
                    maxnumber: data.maxnumber,
                    mid: data.memberRecruit.mid
                });
            })
            .catch(error => {
                console.error('There was an error fetching the recruit!', error);
            });
    }, [rno]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecruit(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleModify = (rno) => {
        axios.put('http://localhost:8080/recruit', { ...recruit, rno })
            .then(response => {
                alert('게시글이 수정되었습니다.');
                navigate(`/recruit/read/${rno}`);
            })
            .catch(error => {
                console.error('There was an error updating the recruit!', error);
                alert('수정 중 오류가 발생했습니다.');
            });
    };

    const handleRowClick = (rno) => {
        navigate(`/recruit/read/${rno}`);
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
            <h1 className="recruitRegister-title">Register Modify</h1>
    
            <form className="recruitRegister-form">
                <input 
                    type="hidden"
                    name="mid"
                    value={recruit.mid}
                    onChange={handleChange}
                    className="recruitRegister-form-input"
                />
                {/* <div>
                    <label>게시글 번호:</label>
                    <input type="text" name="rno" value={recruit.rno} onChange={handleChange} readOnly />
                </div> */}
                <div className="recruitRegister-form-group">
                    <label className="recruitRegister-form-label">제목:</label>
                    <input 
                        type="text"
                        name="title"
                        value={recruit.title}
                        onChange={handleChange}
                        className="recruitRegister-form-input"
                    />
                </div>
                <div className="recruitRegister-form-group">
                    <label className="recruitRegister-form-label">내용:</label>
                    <textarea 
                        name="content"
                        value={recruit.content}
                        onChange={handleChange}
                        className="recruitRegister-form-input"></textarea>
                </div>
                <div className="recruitRegister-form-group">
                    <div>
                        <label className="recruitRegister-form-label">모이는 장소: </label>
                        <input
                            type="text"
                            name="address"
                            value={recruit.address}
                            onChange={handleChange}
                            readOnly
                            className="recruitRegister-form-input"
                        />
                        <button type="button" onClick={() => setOpenPostcode(true)} className="recruitRegister-address-search-button">주소 검색</button>
                    </div>
                </div>
                <div className="recruitRegister-form-group">
                    <label className="recruitRegister-form-label">장소2:</label>
                    <input
                        type="text"
                        name="place"
                        value={recruit.place}
                        onChange={handleChange}
                        className="recruitRegister-form-input"
                    />
                </div>
                <div className="recruitRegister-form-group">
                    <label className="recruitRegister-form-label">날짜:</label>
                    <input
                        type="date"
                        name="date"
                        value={recruit.date}
                        onChange={handleChange}
                        className="recruitRegister-form-input"
                    />
                </div>
                <div className="recruitRegister-form-group">
                    <label className="recruitRegister-form-label">시간:</label>
                    <input
                        type="time"
                        name="time"
                        value={recruit.time}
                        onChange={handleChange}
                        className="recruitRegister-form-input"
                    />
                </div>
                <div className="recruitRegister-form-group">
                    <label className="recruitRegister-form-label">모집인원:</label>
                    <input
                        type="number"
                        name="maxnumber"
                        value={recruit.maxnumber}
                        onChange={handleChange}
                        className="recruitRegister-form-input"
                    />
                </div>
                <button type="button" onClick={() => handleModify(rno)} className="recruitRegister-submit-button">수정 완료</button>
                <button type="button" onClick={() => handleRowClick(rno)} className="recruitRegister-submit-button">수정 취소</button>
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
    );
};

export default RecruitModify;