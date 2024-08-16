import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TeamView = () => {
  const { teamName } = useParams(); // URL에서 teamName 파라미터를 가져옵니다.
  const decodedTeamName = decodeURIComponent(teamName); // 여기서 디코딩
  const navigate = useNavigate(); // 페이지 이동을 위해 useNavigate 사용

  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get(`/team/${decodedTeamName}`);
        setTeamData(response.data);
      } catch (err) {
        setError('팀 정보를 가져오는 중 오류가 발생했습니다.');
        console.error(err);
      }
    };

    fetchTeamData();
  }, [decodedTeamName]);

  const handleEditClick = () => {
    navigate(`/team/edit/${encodeURIComponent(decodedTeamName)}`);
  };


  if (error) {
    return <div>{error}</div>;
  }

  if (!teamData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h2>팀 이름: {teamData.teamName}</h2>
      <p>팀 설명: {teamData.teamExplain}</p>
      <p>팀 리더: {teamData.teamLeader}</p>
      <p>팀원 수: {teamData.teamMemberCount}</p>
      <p>팀 시작일: {teamData.teamStartdate}</p>
      <p>팀 레벨: {teamData.teamLevel}</p>

      <h3>팀 이미지:</h3>
      {teamData.images && teamData.images.length > 0 ? (
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
          {teamData.images.map((image, index) => (
            <div key={index}>
              <img 
                src={`/view/${encodeURIComponent(image.teamManageFileName)}`} 
                alt={`team-${index}`} 
                style={{ width: '300px', height: 'auto' }} // 이미지 크기 조정
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

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleEditClick} style={{ marginRight: '10px' }}>수정</button>
      </div>
    </div>
  );
};

export default TeamView;
