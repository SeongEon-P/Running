import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamEdit.css'; // CSS 파일 import

const TeamEdit = () => {
  const { teamName } = useParams();
  const decodedTeamName = decodeURIComponent(teamName);

  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
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
    const confirmed = window.confirm('정말로 이 팀을 삭제하시겠습니까?');
  
    if (confirmed) {
      try {
        await axios.delete(`/team/${teamData.tno}`);
        navigate('/team/list'); // 삭제 후 팀 목록 페이지로 이동
      } catch (err) {
        setError('팀 삭제 중 오류가 발생했습니다.');
        console.error(err);
      }
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
        // 삭제할 이미지 서버에서 제거
        await Promise.all(
            deletedImages.map(async (fileName) => {
                await axios.delete(`/remove/${encodeURIComponent(fileName)}`);
            })
        );

        // 새로 추가된 이미지 서버로 전송 및 업로드된 파일 이름 받기
        let uploadedImageNames = [];
        if (newImages.length > 0) {
            const formData = new FormData();
            formData.append('teamName', decodedTeamName);
            newImages.forEach((file) => {
                formData.append('files', file);
            });

            const uploadResponse = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // 응답 데이터 확인
            console.log('Upload response:', uploadResponse.data);

            // 서버에서 배열 형식으로 데이터를 반환하는지 확인
            if (Array.isArray(uploadResponse.data)) {
                uploadedImageNames = uploadResponse.data.map((file) => ({
                    teamManageFileName: file.fileName, // 서버에서 반환하는 파일 이름 확인
                }));
            } else {
                console.warn('Unexpected upload response format:', uploadResponse.data);
                throw new Error('Unexpected upload response format');
            }
        }

        // 서버로 전송할 teamData에 새로 업로드된 이미지 추가
        const updatedImages = [...(teamData.images || []), ...uploadedImageNames];
        const updatedTeamData = { ...teamData, images: updatedImages };

        // 수정된 팀 데이터 서버로 전송
        await axios.put(`/team/${decodedTeamName}`, updatedTeamData);

        // 수정 후 상세보기 페이지로 이동
        navigate(`/team/view/${encodeURIComponent(teamData.teamLeader)}`);
    } catch (err) {
        // 에러 메시지 억제
        if (process.env.NODE_ENV === 'development') {
            console.error('수정 중 오류가 발생했습니다.', err);
        }
        setError('수정 중 오류가 발생했습니다.');
    }
  };

  const handleBackClick = () => {
    navigate(`/team/view/${encodeURIComponent(teamData.teamLeader)}`);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="team-edit-container"> {/* CSS 클래스 적용 */}
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
            readOnly
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
          <div className="team-edit-images-container"> {/* CSS 클래스 적용 */}
            {teamData.images.map((image, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img 
                  src={`/view/${encodeURIComponent(image.teamManageFileName)}`} 
                  alt={`team-${index}`} 
                />
                <button
                  type="button"
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
          <div className="team-edit-images-container"> {/* CSS 클래스 적용 */}
            {newImages.map((image, index) => (
              <div key={index}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`new-${index}`}
                />
              </div>
            ))}
          </div>
        )}

        <div className="button-container"> {/* CSS 클래스 적용 */}
          <button type="submit">수정 저장</button>
          <button type="button" onClick={handleDeleteTeam} style={{ background: 'red', color: 'white', marginLeft: '10px' }}>
            팀 삭제
          </button>
          <button type="button" onClick={handleBackClick} style={{ background: '#555', color: 'white', marginLeft: '10px' }}>
            돌아가기
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamEdit;
