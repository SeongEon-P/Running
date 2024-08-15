import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

const RecruitModify = ( rno ) => {

    const [recruit, setRecruit] = useState({
        r_title: '',
        r_content: '',
        r_place: '',
        r_date: '',
        r_time: '',
        max_number: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/recruit/read', { params: { rno } })
        .then(response => {
            const data = response.data;
            setRecruit({
                r_title: data.r_title,
                r_content: data.r_content,
                r_place: data.r_place,
                r_date: data.r_data,
                r_time: data.r_time,
                max_number: data.max_number
            });
        })
        .catch(error => {
            console.error('There was an error fetching the recruit!', error);
        });
    }, [rno]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setRecruit(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleModify = (e) => {
        e.preventDefault();
        axios.put('http://localhost:8080/recruit', recruit)
        .then(response => {
            alert('게시글이 수정되었습니다.');
            navigate(`/recruit/read/${rno}`);
        })
        .catch(error => {
            console.error('There was an error updating the recruit!', error);
            alert('수정 중 오류가 발생했습니다.');
        });
    };

    return (
        <div>
            <h1>게시글 수정</h1>
            <form onSubmit={handleModify}>
                <div>
                    <label>제목:</label>
                    <input type="text" name="r_title" value={recruit.r_title} onChange={handleChange} />
                </div>
                <div>
                    <label>내용:</label>
                    <textarea name="r_content" value={recruit.r_content} onChange={handleChange}></textarea>
                </div>
                <div>
                    <label>장소:</label>
                    <input type="text" name="r_place" value={recruit.r_place} onChange={handleChange} />
                </div>
                <div>
                    <label>날짜:</label>
                    <input type="date" name="r_date" value={recruit.r_date} onChange={handleChange} />
                </div>
                <div>
                    <label>시간:</label>
                    <input type="time" name="r_time" value={recruit.r_time} onChange={handleChange} />
                </div>
                <div>
                    <label>모집인원:</label>
                    <input type="number" name="max_number" value={recruit.max_number} onChange={handleChange} />
                </div>
                <button type="button" onClick={handleModify}>수정 완료</button>
            </form>
        </div>
    );
};

export default RecruitModify;