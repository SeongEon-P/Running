import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';

const RecruitRead = () => {
    const { rno } = useParams();
    const [recruit, setRecruit] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/recruit/read`, { params: { rno } })
        .then(response => {
            setRecruit(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the recruit!', error);
        })
    }, [rno])

    if(!recruit) {
        return <div>Loading...</div>
    }

    const handleBackClick = () => {
        navigate('/recruit/list');
      };
    
    return (
        <div>
            <h1>제목 : {recruit.r_title}</h1>
            <p>내용 : {recruit.r_content}</p>
            <p>장소 : {recruit.r_place}</p>
            <p>날짜 : {recruit.r_date}</p>
            <p>시간 : {recruit.r_time}</p>
            <p>모집인원 : {recruit.max_number}</p>
            <p>게시자 : {recruit.memberRecruit ? recruit.memberRecruit.mid : 'N/A'}</p>
            <button onClick={handleBackClick}>목록으로 가기</button>
        </div>
    )
}

export default RecruitRead;