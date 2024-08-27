import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './TeamList.css'; // CSS 파일을 임포트합니다
import Sidebar from '../components/Sidebar/Sidebar';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [itemsPerPage] = useState(5); // 페이지당 항목 수
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const [searchField, setSearchField] = useState('teamName'); // 검색 기준 상태
  const [filteredTeams, setFilteredTeams] = useState([]); // 필터링된 팀 목록 상태
  const [isLeader, setIsLeader] = useState(false); // LEADER인지 확인하는 상태
  const [showTeamRegisterButton, setShowTeamRegisterButton] = useState(true); // 팀 등록 버튼 표시 여부 상태
  const [isAdmin, setIsAdmin] = useState(false); // ADMIN 여부 확인 상태
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬스토리지에서 role 값 확인
    const loginData = JSON.parse(localStorage.getItem('login'));
    if (loginData) {
      if (loginData.role === 'LEADER') {
        setIsLeader(true); // LEADER이면 true로 설정
      } else if (loginData.role === 'ADMIN') {
        setIsAdmin(true); // admin이면 true로 설정
      } else {
        setIsLeader(false);
      }
    } else {
      setShowTeamRegisterButton(false); // 로컬스토리지에 login 키가 없으면 버튼 숨기기
    }

    const fetchTeams = async () => {
      try {
        const response = await axios.get('/team/all');
        setTeams(response.data);
        setFilteredTeams(response.data); // 초기 상태로 모든 팀 설정
      } catch (err) {
        setError('팀 목록을 가져오는 중 오류가 발생했습니다.');
        console.error(err);
      }
    };

    fetchTeams();
  }, []);

  // 검색 버튼 클릭 시 필터링된 팀 목록 설정
  const handleSearchClick = () => {
    const filtered = teams.filter((team) =>
      team[searchField].toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTeams(filtered);
    setCurrentPage(1); // 검색 후 첫 페이지로 이동
  };

  // 현재 페이지에 따른 항목 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeams = filteredTeams.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

  // 페이지 변경 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);

  if (error) {
    return <div className="TeamList_error">{error}</div>;
  }

  if (teams.length === 0) {
    return <div className="TeamList_error">로딩 중이거나 팀이 없습니다.</div>;
  }

  // 팀 등록 페이지로 이동하는 함수
  const handleTeamRegisterClick = () => {
    navigate('/team/register');
  };

  return (
    <div className="TeamList_layout"> {/* 레이아웃 컨테이너 */}
      <Sidebar /> {/* 사이드바 추가 */}

      <div className="TeamList_content"> {/* 팀 목록 컨텐츠 영역 */}
        <h2 className="TeamList_h2">팀 목록</h2>

        {/* 검색창 및 드롭다운, 팀 등록 버튼을 가로로 정렬 */}
        <div className="TeamList_actionsContainer">
          <div className="TeamList_searchContainer">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="TeamList_searchSelect"
            >
              <option value="teamName">팀 이름</option>
              <option value="teamLeader">팀 리더</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`${searchField === 'teamName' ? '팀 이름' : '팀 리더'} 검색`}
              className="TeamList_searchInput"
            />
            <button onClick={handleSearchClick} className="TeamList_searchButton">
              검색
            </button>
          </div>
          {!isAdmin && showTeamRegisterButton && !isLeader && (
            <button
              className="TeamList_button"
              onClick={handleTeamRegisterClick}
            >
              팀 등록
            </button>
          )}
        </div>

        <ul className="TeamList_ul">
          {currentTeams.map((team) => (
            <li key={team.teamName} className="TeamList_li">
              <Link to={`/team/${encodeURIComponent(team.teamName)}`} className="TeamList_link">
                <div className="TeamList_item">
                  {team.teamLogo ? (
                    <img
                      src={`/view/${team.teamLogo}`}  // 업로드된 로고 이미지를 표시
                      alt={`${team.teamName} 로고`}
                      className="TeamList_item_img" // 이미지 클래스 적용
                    />
                  ) : (
                    <p className="TeamList_no_image">이미지가 없습니다</p> // 없을 때의 텍스트 스타일
                  )}
                  <p>{team.teamName} - {team.teamLeader}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* 페이지네이션 버튼 */}
        <div className="TeamList_pagination">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={index + 1 === currentPage ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamList;
