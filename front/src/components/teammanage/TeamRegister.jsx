import React, { useState } from 'react';
import axios from 'axios';

const TeamRegister = () => {
  const [teamData, setTeamData] = useState({
    teamName: '',
    teamMemberCount: 1,
    teamMembers: '',
    teamStartdate: '',
    teamLeader: '',
    teamLogoFiles: [], // 파일을 배열로 관리
    teamExplain: '',
    teamFromPro: null,
    teamLevel: 1,
  });

  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    setTeamData({
      ...teamData,
      [e.target.name]: e.target.value.trim(),  // trim()으로 불필요한 공백 제거
    });
  };

  const handleFileChange = (e) => {
    setTeamData({
      ...teamData,
      teamLogoFiles: [...e.target.files], // 다중 파일 선택
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // 1. 팀 등록 요청
      const teamResponse = await axios.post('/teamManage/register', {
        teamName: teamData.teamName,
        teamMemberCount: teamData.teamMemberCount,
        teamMembers: teamData.teamMembers,
        teamStartdate: teamData.teamStartdate,
        teamLeader: teamData.teamLeader,
        teamExplain: teamData.teamExplain,
        teamFromPro: teamData.teamFromPro,
        teamLevel: teamData.teamLevel,
      });

      const registeredTeamName = teamResponse.data;

      // 2. 이미지 업로드 요청
      if (teamData.teamLogoFiles.length > 0) {
        const formData = new FormData();
        teamData.teamLogoFiles.forEach((file) => {
          formData.append('files', file); // 'files'로 이름을 맞추기
        });
        formData.append('teamName', registeredTeamName);

        const uploadResponse = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log("Upload Response:", uploadResponse.data);
      }

      setSuccess('팀이 성공적으로 등록되고 로고 이미지가 업로드되었습니다!');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(`오류: ${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`);
      } else {
        setErrors('팀 등록 또는 이미지 업로드 중 오류가 발생했습니다.');
      }
      console.error('Error details:', error);
    }
  };

  return (
    <div>
      <h2>팀 등록 및 로고 이미지 업로드</h2>
      {errors && <p style={{ color: 'red' }}>{errors}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>팀 이름:</label>
          <input
            type="text"
            name="teamName"
            value={teamData.teamName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>팀원 수:</label>
          <input
            type="number"
            name="teamMemberCount"
            value={teamData.teamMemberCount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>팀원 목록:</label>
          <input
            type="text"
            name="teamMembers"
            value={teamData.teamMembers}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>팀 시작일:</label>
          <input
            type="date"
            name="teamStartdate"
            value={teamData.teamStartdate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>팀 리더:</label>
          <input
            type="text"
            name="teamLeader"
            value={teamData.teamLeader}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>팀 로고 이미지:</label>
          <input
            type="file"
            name="teamLogoFiles"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label>팀 설명:</label>
          <textarea
            name="teamExplain"
            value={teamData.teamExplain}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>팀 레벨:</label>
          <input
            type="number"
            name="teamLevel"
            value={teamData.teamLevel}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">팀 등록</button>
      </form>
    </div>
  );
};

export default TeamRegister;
