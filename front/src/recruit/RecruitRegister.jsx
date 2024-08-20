import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const RecruitRegister = () => {
    const [recruit, setRecruit] = useState({
        r_title: '',
        r_content:'',
        r_place: '',
        r_place2: '',
        r_date: '',
        r_time: '',
        max_number:'',
        mid: ''
    });
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



    return (
        <div>
            <h1>Register Recruit</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목: </label>
                    <input
                        type="text"
                        name="r_title"
                        value={recruit.r_title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>내용: </label>
                    <textarea
                        name="r_content"
                        value={recruit.r_content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>모이는 날짜: </label>
                    <input
                        type="date"
                        name="r_date"
                        value={recruit.r_date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    {/* 다음 주소 api 넣을거임 */}
                    <label>모이는 장소: </label>
                    <input
                        type="text"
                        name="r_place"
                        value={recruit.r_place}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>상세 장소: </label>
                    <input
                        type="text"
                        name="r_place2"
                        value={recruit.r_place2}
                        onChange={handleChange}
                        required
                    />
                    <span>찾기 쉽도록 특정 건물이나 건축물을 명시해주시면 더 좋아요!</span>
                </div>
                
                <div>
                    <label>모이는 시간: </label>
                    <input
                        type="time"
                        name="r_time"
                        value={recruit.r_time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>모집 인원: </label>
                    <input
                        type="number"
                        name="max_number"
                        value={recruit.max_number}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* mid 필드는 read-only로 설정 */}
                <div>
                    <label>Member ID: </label>
                    <input
                        type="text"
                        name="mid"
                        value={recruit.mid}
                        readOnly
                    />
                </div>
                <button type="button" onClick={handleSubmit}>Register</button>
            </form>
        </div>
    )
}

export default RecruitRegister;