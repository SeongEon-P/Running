import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';

const RecruitRead = () => {
    const { rno } = useParams();
    const [recruit, setRecruit] = useState(null);
    const [count, setCount] = useState(null);
    const [appliedList, setAppliedList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/recruit/read', { params: { rno } })
            .then(response => {
                setRecruit(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the recruit!', error);
            });

        axios.get('http://localhost:8080/apply/count', { params: { rno } })
            .then(response => {
                setCount(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the recruit count!', error);
            });

        axios.get('http://localhost:8080/apply', { params: { rno } })
            .then(response => {
                setAppliedList(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the apply list!', error)
            });
    }, [rno])

    if (!recruit) {
        return <div>Loading...</div>
    }

    const handleBackClick = () => {
        navigate('/recruit/list');
    };

    // 날짜 형식 변환 함수 추가
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // 'en-CA' 형식을 사용하면 'yyyy-mm-dd'로 표시됩니다.
    };

    // 시간 형식 변환 함수 추가
    const formatTime = (time) => {
        if (typeof time === 'string' || time instanceof String) {
            const [hour, minute, second] = time.split(':');
            return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
        }
        return time;
    };

    return (
        <>
            <div>
                <h1>제목 : {recruit.r_title}</h1>
                <p>내용 : {recruit.r_content}</p>
                <p>장소 : {recruit.r_place}</p>
                <p>날짜 : {formatDate(recruit.r_date)}</p>
                <p>시간 : {formatTime(recruit.r_time)}</p>
                <p>모집인원 : {count !== null ? `${count}/${recruit.max_number}` : 'Loading...'}</p>
                <p>게시자 : {recruit.memberRecruit ? recruit.memberRecruit.mid : 'N/A'}</p>
                <button onClick={handleBackClick}>목록으로 가기</button>
            </div>
            <div>
                <h1>신청한 사람</h1>
                <tbody>
                    {appliedList.length > 0 ? ( // appliedList가 유효한 배열인지 확인
                        appliedList.map(applied => (
                            <tr key={applied.ano}>
                                <td>{applied.memberApply.mid}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>신청자가 없습니다.</td>
                        </tr>
                    )}
                </tbody>

            </div>
        </>
    )
}

export default RecruitRead;