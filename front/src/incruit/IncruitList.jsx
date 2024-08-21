import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './IncruitList.css';  // 스타일 파일 import

const IncruitList = () => {
    const [incruitList, setIncruitList] = useState([]);
    const [error, setError] = useState(null);
    const [isLeader, setIsLeader] = useState(false); // LEADER인지 확인하는 상태
    const [showTeamRegisterButton, setShowTeamRegisterButton] = useState(true); // 팀 등록 버튼 표시 여부 상태
    const navigate = useNavigate();

    useEffect(() => {
        // 로컬스토리지에서 role 값 확인
        const loginData = JSON.parse(localStorage.getItem('login'));
        if (loginData) {
            if (loginData.role === 'LEADER') {
                setIsLeader(true); // LEADER이면 true로 설정
            } else {
                setIsLeader(false);
            }
        } else {
            setShowTeamRegisterButton(false); // 로컬스토리지에 login 키가 없으면 버튼 숨기기
        }

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

    // 팀 등록 페이지로 이동하는 함수
    const handleTeamRegisterClick = () => {
        navigate('/team/register');
    };

    return (
        <div className="IncruitList_container">
            <h2 className="IncruitList_h2">모집 리스트</h2>
            {error && <p className="IncruitList_error">{error}</p>}
            <div className="IncruitList_buttons">
                {/* 로컬스토리지에 login 키가 있을 때만 팀 등록 버튼을 표시 */}
                {showTeamRegisterButton && !isLeader && (
                    <button 
                        className="IncruitList_button" 
                        onClick={handleTeamRegisterClick} 
                    >
                        팀 등록
                    </button>
                )}
                {/* isLeader가 true일 경우에만 모집글 작성 버튼을 표시 */}
                {isLeader && (
                    <button 
                        className="IncruitList_button" 
                        onClick={handleCreateClick}
                    >
                        모집글 작성
                    </button>
                )}
            </div>
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
