import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './IncruitList.css';  // 스타일 파일 import

const IncruitList = () => {
    const [incruitList, setIncruitList] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIncruitList = async () => {
            try {
                const response = await axios.get('/incruit/list');
                setIncruitList(response.data);
            } catch (err) {
                setError('모집 리스트를 불러오는 중 오류가 발생했습니다.');
                console.error(err);
            }
        };

        fetchIncruitList();
    }, []);

    // 조회수 증가 후 상세보기 페이지로 이동하는 함수
    const handleViewClick = async (ino) => {
        try {
            // 조회수 증가 API 호출
            await axios.post(`/incruit/increase-views/${ino}`);
            // 상세보기 페이지로 이동
            navigate(`/incruit/${ino}`);
        } catch (err) {
            console.error('조회수 증가 중 오류가 발생했습니다.', err);
        }
    };

    // 모집글 작성 페이지로 이동하는 함수
    const handleCreateClick = () => {
        navigate('/incruit/register');
    };

    return (
        <div className="IncruitList_container">
            <h2 className="IncruitList_h2">모집 리스트</h2>
            {error && <p className="IncruitList_error">{error}</p>}
            <button 
                className="IncruitList_button" 
                onClick={handleCreateClick}
            >
                모집글 작성
            </button>
            <ul className="IncruitList_ul">
                {incruitList.map((incruit) => (
                    <li key={incruit.ino} className="IncruitList_li">
                        <Link to={`/incruit/${incruit.ino}`} className="IncruitList_link"
                        onClick={() => handleViewClick(incruit.ino)}>
                            {incruit.ititle} - {incruit.iwriter} (조회수: {incruit.iviews})
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IncruitList;
