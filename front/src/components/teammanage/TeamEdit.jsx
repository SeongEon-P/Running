import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TeamEdit = () => {
  const { teamName } = useParams();
  const decodedTeamName = decodeURIComponent(teamName);

  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]); // 새로 추가된 이미지
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get(`/team/${decodedTeamName}`);
        setTeamData(response.data);
      } catch (err) {
        setError('팀 정보를 가져오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [decodedTeamName]);

  const handleDeleteTeam = async () => {
    try {
      await axios.delete(`/team/${teamData.tno}`);
      navigate('/team/list'); // 삭제 후 팀 목록 페이지로 이동
    } catch (err) {
      setError('팀 삭제 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeamData({ ...teamData, [name]: value });
  };

  const handleImageDelete = (image) => {
    setDeletedImages([...deletedImages, image.teamManageFileName]);
    setTeamData({
      ...teamData,
      images: teamData.images.filter(img => img.teamManageFileName !== image.teamManageFileName)
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 삭제할 이미지 서버에서 제거 (파일 시스템 및 데이터베이스에서 모두 삭제)
      await Promise.all(
        deletedImages.map(async (fileName) => {
          await axios.delete(`/remove/${encodeURIComponent(fileName)}`);
        })
      );

      // 새로 추가된 이미지 서버로 전송
      if (newImages.length > 0) {
        const formData = new FormData();
        formData.append('teamName', decodedTeamName);
        newImages.forEach((file) => {
          formData.append('files', file);
        });
        await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // 수정된 팀 데이터 서버로 전송
      await axios.put(`/team/${decodedTeamName}`, teamData);

      // 수정 후 상세보기 페이지로 이동
      navigate(`/team/${encodeURIComponent(teamName)}`);
    } catch (err) {
      setError('수정 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>{decodedTeamName} 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>팀 설명:</label>
          <textarea
            name="teamExplain"
            value={teamData.teamExplain || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>팀 리더:</label>
          <input
            type="text"
            name="teamLeader"
            value={teamData.teamLeader || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>팀원 수:</label>
          <input
            type="number"
            name="teamMemberCount"
            value={teamData.teamMemberCount || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>팀 시작일:</label>
          <input
            type="date"
            name="teamStartdate"
            value={teamData.teamStartdate || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>팀 레벨:</label>
          <input
            type="number"
            name="teamLevel"
            value={teamData.teamLevel || ''}
            onChange={handleInputChange}
          />
        </div>

        <h3>팀 이미지:</h3>
        {teamData.images && teamData.images.length > 0 ? (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
            {teamData.images.map((image, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img 
                  src={`/view/${encodeURIComponent(image.teamManageFileName)}`} 
                  alt={`team-${index}`} 
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
                  onClick={() => handleImageDelete(image)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>이미지가 없습니다.</p>
        )}

        <h3>새 이미지 추가:</h3>
        <input type="file" multiple onChange={handleImageChange} />
        {newImages.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
            {newImages.map((image, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`new-${index}`}
                  style={{ width: '150px', height: 'auto' }}
                />
              </div>
            ))}
          </div>
        )}

        <button type="submit">수정 저장</button>
        <button type="button" onClick={handleDeleteTeam} style={{ background: 'red', color: 'white', marginLeft: '10px' }}>
          팀 삭제
        </button>
      </form>
    </div>
  );
};

export default TeamEdit;
