import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamView.css'; // CSS 파일을 import 합니다.

const TeamView = () => {
  const { teamLeader } = useParams();
  const decodedTeamLeader = decodeURIComponent(teamLeader || "");
  const navigate = useNavigate();

  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]); // 팀원 등록 요청 상태

  useEffect(() => {
    console.log("Team leader received in TeamView:", decodedTeamLeader);

    if (!decodedTeamLeader) {
      setError('팀 리더가 정의되지 않았습니다.');
      return;
    }

    const fetchTeamData = async () => {
      try {
        const response = await axios.get(`/team/leader/${decodedTeamLeader}`);
        const data = response.data;

        // 팀 시작일을 'yyyy-MM-dd' 형식으로 변환
        if (data.teamStartdate) {
          data.teamStartdate = new Date(data.teamStartdate).toISOString().split('T')[0];
        }

        setTeamData(data);
      } catch (err) {
        setError('팀 정보를 가져오는 중 오류가 발생했습니다.');
        console.error(err);
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await axios.get('/team/member-requests');
        setRequests(response.data);
      } catch (err) {
        console.error('팀원 등록 요청을 불러오는 중 오류가 발생했습니다.', err);
      }
    };

    fetchTeamData();
    fetchRequests();
  }, [decodedTeamLeader]);

  const handleEditClick = () => {
    // 팀 이름을 URL에 포함하여 수정 페이지로 이동
    navigate(`/team/edit/${encodeURIComponent(teamData.teamName)}`);
  };

  const handleBackClick = () => {
    // /mypage로 이동
    navigate('/mypage');
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.post('/team/accept-request', { requestId });
      // 요청 수락 후 목록 갱신
      setRequests(requests.filter(request => request.id !== requestId));
      // 팀 정보 갱신 (팀원 수 증가 반영)
      setTeamData(prevData => ({
        ...prevData,
        teamMemberCount: prevData.teamMemberCount + 1
      }));
    } catch (err) {
      console.error('팀원 등록 요청 수락 중 오류가 발생했습니다.', err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axios.post('/team/reject-request', { requestId });
      // 요청 거절 후 목록 갱신
      setRequests(requests.filter(request => request.id !== requestId));
    } catch (err) {
      console.error('팀원 등록 요청 거절 중 오류가 발생했습니다.', err);
    }
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

      <h3>팀원 등록 요청</h3>
      <ul>
        {requests.map(request => (
          <li key={request.id}>
            {request.userName} 님의 등록 요청...
            <button onClick={() => handleAcceptRequest(request.id)}>수락</button>
            <button 
              onClick={() => handleRejectRequest(request.id)} 
              className="reject-button"
            >
              거절
            </button>
          </li>
        ))}
      </ul>

      <div className="button-container">
        <button onClick={handleEditClick} className="edit-button">수정</button>
        <button onClick={handleBackClick} className="back-button">돌아가기</button>
      </div>
    </div>
  );
};

export default TeamView;
