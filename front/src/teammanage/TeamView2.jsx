import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamView.css'; // CSS 파일을 import 합니다.

const TeamView2 = () => {
  const { teamMembers } = useParams();
  const decodedTeamMembers = decodeURIComponent(teamMembers || "");
  const navigate = useNavigate();

  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Team members received in TeamView2:", decodedTeamMembers);

    if (!decodedTeamMembers) {
      setError('팀원이 정의되지 않았습니다.');
      return;
    }

    const fetchTeamData = async () => {
      try {
        const response = await axios.get(`/team/members/${decodedTeamMembers}`);
        const data = response.data;

        // 팀 시작일을 'yyyy-MM-dd' 형식으로 변환
        if (data.teamStartdate) {
          data.teamStartdate = new Date(data.teamStartdate).toISOString().split('T')[0];
        }

        setTeamData(data);
      } catch (err) {
        setError('소속되어있는 팀이 없습니다.');
        console.error(err);
      }
    };

    fetchTeamData();
  }, [decodedTeamMembers]);

  const handleBackClick = () => {
    // /mypage로 이동
    navigate('/mypage');
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!teamData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="team-view-container">
      <h2>{teamData.teamName}</h2>
      <p>팀 설명: {teamData.teamExplain}</p>
      <p>팀 리더: {teamData.teamLeader}</p>
      <p>팀원 수: {teamData.teamMemberCount}</p>
      <p>팀원: {teamData.teamMembers}</p>
      <p>팀 시작일: {teamData.teamStartdate}</p>
      <p>팀 레벨: {teamData.teamLevel}</p>

      <h3>팀 이미지:</h3>
      {teamData && teamData.imageList && teamData.imageList.length > 0 ? (
        <div className="team-images-container">
          {Array.from(teamData.imageList).map((image, index) => (
            <div key={index}>
              <img
                src={`/view/${encodeURIComponent(image.teamManageFileName)}`}
                alt={`team-${index}`}
                className="team-image"
                onError={(e) => {
                  e.target.onerror = null;
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>이미지가 없습니다.</p>
      )}

      <div className="button-container">
        <button onClick={handleBackClick} className="back-button">돌아가기</button>
      </div>
    </div>
  );
};

export default TeamView2;
