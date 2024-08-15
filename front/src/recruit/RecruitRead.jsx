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

    // 목록으로 가기
    const handleBackClick = () => {
        navigate('/recruit/list');
    };

    // 수정 페이지로 가기
    const handleModifyClick = (rno) => {
        navigate(`/recruit/modify/${rno}`);
    }

    const handleDeleteClick = () => {
        if(window.confirm('삭제하시겠습니까?')){
            axios.delete(`http://localhost:8080/recruit/${rno}`)
            .then(response => {
                alert('게시글이 삭제되었습니다.');
                navigate('/recruit/list')
            })
            .catch(error => {
                console.error('There was an error deleting the recruit!', error);
                alert('삭제 중 오류가 발생했습니다.');
            })
        }
    }

    // 날짜 형식 변환 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // 'en-CA' 형식을 사용하면 'yyyy-mm-dd'로 표시됩니다.
    };

    // 배열로 이루어져 있는 날짜/시간 데이터의 표시 형식을 변환하는 법
    // const formatDate = (dateArray) => {
    //     const [year, month, day] = dateArray;
    //     return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // };

    // 시간 형식 변환 함수
    const formatTime = (timeArray) => {
        const [hour, minute] = timeArray;
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
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
                <button onClick={() => handleModifyClick(rno)}>수정</button>
                <button onClick={handleDeleteClick}>삭제</button>
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