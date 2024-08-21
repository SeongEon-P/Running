import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TeamRegister.css';  // CSS 파일을 import 합니다.

const TeamRegister = () => {
  const [teamData, setTeamData] = useState({
    teamName: '',
    teamMemberCount: 1,
    teamMembers: '',
    teamStartdate: '',
    teamLeader: '',
    teamExplain: '',
    teamFromPro: null,
    teamLevel: 1,
  });

  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newImages, setNewImages] = useState([]); // 새로 추가된 이미지
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // 1. 팀 생성 요청을 위한 FormData 구성
      const formData = new FormData();
      formData.append('teamData', new Blob([JSON.stringify(teamData)], { type: 'application/json' }));
      
      // 이미지 파일 추가
      newImages.forEach((file) => {
        formData.append('images', file);
      });

      // 팀 생성 요청을 서버에 전송
      await axios.post('/team/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('팀 생성 요청이 제출되었습니다. 관리자의 승인을 기다려주세요.');
      
      // 팀 생성 대기 목록으로 이동
      navigate('/team/request/list');

    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(`오류: ${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`);
      } else {
        setErrors('팀 생성 요청 중 오류가 발생했습니다.');
      }
      console.error('Error details:', error);
    }
  };

  // 돌아가기 버튼 핸들러
  const handleBackClick = () => {
    navigate('/incruit/list');
  };

  return (
    <div className="team-register-container">  {/* 적용된 스타일 */}
      <h2>팀 생성 요청</h2>
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
            readOnly  // 팀 리더 필드를 읽기 전용으로 설정
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
          <div className="image-preview-container"> {/* 이미지 미리보기 스타일 적용 */}
            {newImages.map((image, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`new-${index}`}
                />
                <button
                  type="button"
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
        <div className="button-container">
          <button type="submit">팀 생성 요청</button>
          <button type="button" onClick={handleBackClick} style={{ marginLeft: '10px' }}>돌아가기</button> {/* 돌아가기 버튼 추가 */}
        </div>
      </form>
    </div>
  );
};

export default TeamRegister;
