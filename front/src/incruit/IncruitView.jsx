import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './IncruitView.css';  // 스타일 파일 import

const IncruitView = () => {
    const { ino } = useParams(); // URL에서 ino를 가져옴
    const [incruit, setIncruit] = useState(null);
    const [error, setError] = useState(null);
    const [isLeader, setIsLeader] = useState(false); // 팀 리더 여부 확인 상태
    const [isUser, setIsUser] = useState(false); // 일반 사용자 여부 확인 상태
    const navigate = useNavigate();

    useEffect(() => {
        // 서버로부터 모집 상세 정보를 가져오는 함수
        const fetchIncruit = async () => {
            try {
                const response = await axios.get(`/incruit/${ino}`);
                setIncruit(response.data);

                // 로컬스토리지에서 로그인된 사용자의 정보를 가져와 역할을 확인
                const loginData = JSON.parse(localStorage.getItem('login'));
                if (loginData) {
                    if (loginData.name === response.data.teamLeader) {
                        setIsLeader(true); // 팀 리더와 일치하면 수정 가능
                    }
                    if (loginData.role === 'USER') {
                        setIsUser(true); // 일반 사용자라면 신청 가능
                    }
                }
            } catch (err) {
                setError('모집 정보를 불러오는 중 오류가 발생했습니다.');
                console.error(err);
            }
        };

        fetchIncruit();
    }, [ino]);

    // 팀원 등록 신청 버튼 클릭 시 호출되는 함수
    const handleJoinRequest = async () => {
        try {
            const loginData = JSON.parse(localStorage.getItem('login'));
            const response = await axios.post('/team/join-request', {
                teamName: incruit.teamName,
                userName: loginData.name,
            });
            alert('팀원 등록 요청이 전송되었습니다.');
        } catch (err) {
            console.error('팀원 등록 요청 중 오류가 발생했습니다.', err);
            alert('팀원 등록 요청 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="IncruitView_container">
            {error && <p className="IncruitView_error">{error}</p>}
            {incruit ? (
                <div>
                    <h2 className="IncruitView_h2">{incruit.ititle}</h2>
                    <p className="IncruitView_p">작성자: {incruit.iwriter}</p>
                    <p className="IncruitView_p">내용: {incruit.icontent}</p>
                    <p className="IncruitView_p">팀 이름: {incruit.teamName}</p>
                    <p className="IncruitView_p">팀 설명: {incruit.teamExplain}</p>
                    <p className="IncruitView_p">팀 리더: {incruit.teamLeader}</p>
                    <p className="IncruitView_p">팀원 수: {incruit.teamMemberCount}</p>
                    <p className="IncruitView_p">팀원: {incruit.teamMembers}</p>
                    <p className="IncruitView_p">팀 시작일: {new Date(incruit.teamStartdate).toLocaleDateString()}</p>
                    <p className="IncruitView_p">
                        등록일: {new Date(incruit.regDate[0], incruit.regDate[1] - 1, incruit.regDate[2], incruit.regDate[3], incruit.regDate[4], incruit.regDate[5]).toLocaleDateString()}
                    </p>
                    <p className="IncruitView_p">조회수: {incruit.iviews}</p>

                    {/* 이미지 리스트를 3x3 그리드로 렌더링 */}
                    {incruit.images && incruit.images.length > 0 ? (
                        <div className="IncruitView_imageGrid">
                            {incruit.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={`/view/${encodeURIComponent(img.teamManageFileName)}`}
                                    alt={`Team Image ${index + 1}`}
                                    className="IncruitView_img"
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="IncruitView_p">팀 이미지가 없습니다.</p>
                    )}

                    <div className="IncruitView_buttonContainer">
                        {isLeader && ( // 팀 리더와 일치할 때만 수정 버튼을 보여줍니다.
                            <button
                                onClick={() => navigate(`/incruit/edit/${ino}`)}
                                className="IncruitView_button"
                            >
                                수정
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/incruit/list')}
                            className="IncruitView_button"
                        >
                            목록
                        </button>
                        {isUser && ( // 일반 사용자일 때만 팀원 등록 신청 버튼을 보여줍니다.
                            <button
                                onClick={handleJoinRequest}
                                className="IncruitView_button"
                            >
                                팀원 등록 신청
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <p className="IncruitView_p">Loading...</p>
            )}
        </div>
    );
};

export default IncruitView;
