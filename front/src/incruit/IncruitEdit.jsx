import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const IncruitEdit = () => {
    const { ino } = useParams(); // URL에서 ino를 가져옴
    const [teamNames, setTeamNames] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [incruitData, setIncruitData] = useState({
        ititle: '',
        icontent: '',
        iwriter: '',
        teamName: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 기존 모집 데이터를 불러오기
    useEffect(() => {
        const fetchIncruit = async () => {
            try {
                const response = await axios.get(`/incruit/${ino}`);
                const incruit = response.data;
                setIncruitData({
                    ititle: incruit.ititle,
                    icontent: incruit.icontent,
                    iwriter: incruit.iwriter,
                    teamName: incruit.teamName,
                });
                // 팀 정보를 설정
                const teamResponse = await axios.get(`/incruit/team/${incruit.teamName}`);
                setSelectedTeam(teamResponse.data);
            } catch (err) {
                setError('기존 모집 데이터를 불러오는 중 오류가 발생했습니다.');
                console.error(err);
            }
        };

        fetchIncruit();
    }, [ino]);

    // 팀 이름 목록 불러오기
    useEffect(() => {
        const fetchTeamNames = async () => {
            try {
                const response = await axios.get('/incruit/names');
                setTeamNames(response.data);
            } catch (err) {
                setError('팀 이름을 불러오는 중 오류가 발생했습니다.');
                console.error(err);
            }
        };

        fetchTeamNames();
    }, []);

    // 팀 선택 시 해당 팀 정보 불러오기
    const handleTeamChange = async (e) => {
        const teamName = e.target.value;
        setIncruitData({ ...incruitData, teamName });

        if (teamName) {
            try {
                const response = await axios.get(`/incruit/team/${teamName}`);
                const teamData = response.data;

                setSelectedTeam(teamData);
                setIncruitData({
                    ...incruitData,
                    teamName,
                    iwriter: teamData.teamLeader
                });
            } catch (err) {
                setError('팀 데이터를 불러오는 중 오류가 발생했습니다.');
                console.error(err);
            }
        } else {
            setSelectedTeam(null);
            setIncruitData({ ...incruitData, iwriter: '', teamName: '' });
        }
    };

    // 인풋 필드 변경 시 상태 업데이트
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setIncruitData({ ...incruitData, [name]: value });
    };

    // 폼 제출 시 모집 수정
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/incruit/${ino}`, incruitData);
            navigate('/incruit/list'); // 수정 후 리스트 페이지로 이동
        } catch (err) {
            setError('수정 중 오류가 발생했습니다.');
            console.error(err);
        }
    };

    // 모집 삭제 함수
    const handleDelete = async () => {
        const confirmed = window.confirm('정말 삭제하겠습니까?');
        if (confirmed) {
            try {
                await axios.delete(`/incruit/${ino}`);
                navigate('/incruit/list'); // 삭제 후 리스트 페이지로 이동
            } catch (err) {
                setError('삭제 중 오류가 발생했습니다.');
                console.error(err);
            }
        }
    };

    return (
        <div>
            <h2>모집 수정</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>팀 선택:</label>
                    <select onChange={handleTeamChange} value={incruitData.teamName} required>
                        <option value="">팀을 선택하세요</option>
                        {teamNames.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedTeam && (
                    <div>
                        <h3>선택된 팀 정보</h3>
                        <p>팀 설명: {selectedTeam.teamExplain}</p>
                        <p>팀 리더: {selectedTeam.teamLeader}</p>
                        <p>팀원 수: {selectedTeam.teamMemberCount}</p>
                        <p>팀 시작일: {selectedTeam.teamStartdate}</p>

                        <h3>팀 이미지:</h3>
                        {selectedTeam.images && selectedTeam.images.length > 0 ? (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {selectedTeam.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={`/view/${encodeURIComponent(image.teamManageFileName)}`}
                                        alt={`team-${index}`}
                                        style={{ width: '300px', height: 'auto' }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>이미지가 없습니다.</p>
                        )}
                    </div>
                )}

                <div>
                    <label>모집 제목:</label>
                    <input
                        type="text"
                        name="ititle"
                        value={incruitData.ititle}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>모집 내용:</label>
                    <textarea
                        name="icontent"
                        value={incruitData.icontent}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>작성자:</label>
                    <input
                        type="text"
                        name="iwriter"
                        value={incruitData.iwriter}
                        onChange={handleInputChange}
                        required
                        readOnly // 작성자 필드를 읽기 전용으로 설정
                    />
                </div>

                <button type="submit">수정</button>
                <button type="button" onClick={handleDelete} style={{ marginLeft: '10px' }}>
                    삭제
                </button>
            </form>
        </div>
    );
};

export default IncruitEdit;
