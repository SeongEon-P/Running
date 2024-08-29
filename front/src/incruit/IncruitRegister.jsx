import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './IncruitRegister.css';  // 스타일 파일 import

const IncruitRegister = () => {
    const [incruitData, setIncruitData] = useState({
        ititle: '',
        icontent: '',
        iwriter: '',
        teamName: '',
    });
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 팀 데이터를 로드하는 함수
    useEffect(() => {
        const loadTeamData = async () => {
            try {
                // 로컬스토리지에서 login 정보 가져오기
                const loginData = JSON.parse(localStorage.getItem('login'));
                if (!loginData || !loginData.name) {
                    setError('로그인 정보가 없습니다.');
                    return;
                }

                // teamLeader와 일치하는 팀 데이터 가져오기
                const response = await axios.get(`/incruit/team/leader/${loginData.name}`);
                const teamData = response.data;

                // 팀 시작일을 'yyyy-MM-dd' 형식으로 변환
                const formattedStartDate = new Date(teamData.teamStartdate).toISOString().split('T')[0];

                setSelectedTeam({
                    ...teamData,
                    teamStartdate: formattedStartDate,
                });
                setIncruitData({
                    ...incruitData,
                    teamName: teamData.teamName,
                    iwriter: teamData.teamLeader,
                });
            } catch (err) {
                setError('팀 데이터를 불러오는 중 오류가 발생했습니다.');
                console.error(err);
            }
        };

        loadTeamData();
    }, []); // 의존성 배열에 아무 것도 없으므로 컴포넌트가 처음 마운트될 때만 실행됨

    // 인풋 필드 변경 시 상태 업데이트
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setIncruitData({ ...incruitData, [name]: value });
    };

    // 폼 제출 시 모집 등록
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/incruit/register', incruitData);
            navigate('/incruit/list'); // 등록 후 리스트 페이지로 이동
        } catch (err) {
            setError('등록 중 오류가 발생했습니다.');
            console.error(err);
        }
    };

    // 목록 버튼 클릭 시 목록 페이지로 이동
    const handleBackToList = () => {
        navigate('/incruit/list');
    };

    return (
        <div className="IncruitRegister_container">
            <h2 className="IncruitRegister_h2">모집 등록</h2>
            {error && <p className="IncruitRegister_error">{error}</p>}
            <form onSubmit={handleSubmit}>
                {selectedTeam && (
                    <div className="IncruitRegister_teamInfo">
                        <h3>팀 정보</h3>
                        <p>팀 이름: {selectedTeam.teamName}</p>
                        <p>팀 설명: {selectedTeam.teamExplain}</p>
                        <p>팀 리더: {selectedTeam.teamLeader}</p>
                        <p>팀원 수: {selectedTeam.teamMemberCount}</p>
                        <p>팀원: {selectedTeam.teamMembers}</p>
                        <p>팀 시작일: {selectedTeam.teamStartdate}</p>

                        <h3>팀 이미지:</h3>
                        {selectedTeam.images && selectedTeam.images.length > 0 ? (
                            <div className="IncruitRegister_imageContainer">
                                {selectedTeam.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={`/view/${encodeURIComponent(image.teamManageFileName)}`}
                                        alt={`team-${index}`}
                                        className="IncruitRegister_image"
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>이미지가 없습니다.</p>
                        )}
                    </div>
                )}

                <div className="IncruitRegister_formGroup">
                    <label className="IncruitRegister_label">모집 제목:</label>
                    <input
                        type="text"
                        name="ititle"
                        value={incruitData.ititle}
                        onChange={handleInputChange}
                        required
                        className="IncruitRegister_input"
                    />
                </div>

                <div className="IncruitRegister_formGroup">
                    <label className="IncruitRegister_label">모집 내용:</label>
                    <textarea
                        name="icontent"
                        value={incruitData.icontent}
                        onChange={handleInputChange}
                        required
                        className="IncruitRegister_textarea"
                    />
                </div>

                <div className="IncruitRegister_formGroup">
                    <label className="IncruitRegister_label">작성자:</label>
                    <input
                        type="text"
                        name="iwriter"
                        value={incruitData.iwriter}
                        onChange={handleInputChange}
                        required
                        readOnly
                        className="IncruitRegister_input"
                    />
                </div>

                <div className="IncruitRegister_buttonContainer">
                    <button type="submit" className="IncruitRegister_button">등록</button>
                    <button 
                        type="button" 
                        onClick={handleBackToList} 
                        className="IncruitRegister_button"
                        style={{ marginLeft: '10px' }}
                    >
                        목록
                    </button>
                </div>
            </form>
        </div>
    );
};

export default IncruitRegister;
