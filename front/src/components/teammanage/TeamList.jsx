import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('/team/all'); // '/teamManage/all' -> '/team/all'로 수정
        setTeams(response.data);
      } catch (err) {
        setError('팀 목록을 가져오는 중 오류가 발생했습니다.');
        console.error(err);
      }
    };

    fetchTeams();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (teams.length === 0) {
    return <div>로딩 중이거나 팀이 없습니다.</div>;
  }

  return (
    <div>
      <h2>팀 목록</h2>
      <ul>
        {teams.map((team) => (
          <li key={team.teamName}>
            <Link to={`/team/${encodeURIComponent(team.teamName)}`}>
              <div>
                {team.teamLogo ? (
                  <img 
                    src={`/view/${team.teamLogo}`}  // 업로드된 로고 이미지를 표시
                    alt={`${team.teamName} 로고`} 
                    style={{ width: '500px', height: 'auto' }}  // 이미지 크기 조절
                  />
                ) : (
                  <p>이미지가 없습니다</p>
                )}
                <p>{team.teamName}</p>
              </div> 
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamList;
