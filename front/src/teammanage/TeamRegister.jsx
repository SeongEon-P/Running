import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const [newImages, setNewImages] = useState([]); // 새로 추가된 이미지
  const navigate = useNavigate(); // navigate 함수 추가

  useEffect(() => {
    // 로컬스토리지에서 로그인한 사용자의 이름을 가져와 팀 리더로 설정
    const loginData = JSON.parse(localStorage.getItem('login'));
    if (loginData && loginData.name) {
      setTeamData(prevData => ({
        ...prevData,
        teamLeader: loginData.name
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    setTeamData({
      ...teamData,
      [e.target.name]: e.target.value.trim(),  // trim()으로 불필요한 공백 제거
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]); // 새 이미지 추가
  };

  const handleImageDelete = (index) => {
    const updatedImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedImages);
  };

  // 사용자의 역할을 LEADER로 업데이트하는 메서드
  const updateRole = async (username) => {
    try {
      await axios.post('/members/updateRole', {
        mid: username,
        role: 'LEADER'
      });
    } catch (error) {
      console.error('사용자 역할 업데이트 중 오류가 발생했습니다:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // 1. 팀 등록 요청
      const teamResponse = await axios.post('/team/register', {
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
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((file) => {
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
      
      // 3. 팀 등록 후 역할 업데이트
      const loginData = JSON.parse(localStorage.getItem('login'));
      if (loginData && loginData.name) {
        await updateRole(loginData.mid);  // 사용자 역할을 LEADER로 업데이트
      }

      // 성공적으로 등록된 후 팀 목록으로 이동
      navigate('/team/list');

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
            readOnly // 팀 리더 필드를 읽기 전용으로 설정
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

        {newImages.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
            {newImages.map((image, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`new-${index}`}
                  style={{ width: '150px', height: 'auto' }}
                />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleImageDelete(index)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

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
