import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './IncruitList.css';
import Sidebar from '../components/Sidebar/Sidebar';

const IncruitList = () => {
    const [incruitList, setIncruitList] = useState([]);
    const [filteredIncruitList, setFilteredIncruitList] = useState([]); // 필터링된 리스트 상태
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
    const [searchField, setSearchField] = useState('ititle'); // 검색 기준 상태 (기본값은 ititle)
    const [error, setError] = useState(null);
    const [isLeader, setIsLeader] = useState(false); // LEADER인지 확인하는 상태
    const [isAdmin, setIsAdmin] = useState(false); // ADMIN 여부 확인 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [itemsPerPage] = useState(10); // 페이지당 항목 수
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
        }

        const fetchIncruitList = async () => {
            try {
                const response = await axios.get('/incruit/list');
                setIncruitList(response.data);
                setFilteredIncruitList(response.data); // 초기 리스트를 필터링된 리스트로 설정
            } catch (err) {
                setError('모집 리스트를 불러오는 중 오류가 발생했습니다.');
                console.error(err);
            }
        };

        fetchIncruitList();
    }, []);

    // 검색어가 변경될 때 호출되는 함수
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    // 검색 기준이 변경될 때 호출되는 함수
    const handleSearchFieldChange = (e) => {
        setSearchField(e.target.value);
        setSearchQuery(''); // 검색어 초기화
        setFilteredIncruitList(incruitList); // 필터링된 리스트 초기화
    };

    // 검색 버튼 클릭 시 호출되는 함수
    const handleSearchClick = () => {
        const filteredList = incruitList.filter(incruit =>
            incruit[searchField].toLowerCase().includes(searchQuery)
        );
        setFilteredIncruitList(filteredList);
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    // 조회수 증가 후 상세보기 페이지로 이동하는 함수
    const handleViewClick = async (ino) => {
        try {
            // 조회수 증가 API 호출
            await axios.post(`/incruit/increase-views/${ino}`);
            // 상세보기 페이지로 이동
            navigate(`/incruit/${ino}`);
        } catch (err) {
            console.error('조회수 증가 중 오류가 발생했습니다.', err);
        }
    };

    // 모집글 작성 페이지로 이동하는 함수
    const handleCreateClick = () => {
        navigate('/incruit/register');
    };

    // 현재 페이지에 따른 항목 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredIncruitList.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredIncruitList.length / itemsPerPage);

    return (
        <div className="IncruitList_layout">
            {/* 사이드바 추가 */}
            <Sidebar />

            {/* 리스트 및 검색 부분 */}
            <div className="IncruitList_content">
                <h2 className="IncruitList_h2">모집 리스트</h2>
                {error && <p className="IncruitList_error">{error}</p>}

                {/* 검색 및 버튼 컨테이너 */}
                <div className="IncruitList_actionsContainer">
                    <div className="IncruitList_searchContainer">
                        {/* 검색 기준 선택 드롭다운 */}
                        <select
                            value={searchField}
                            onChange={handleSearchFieldChange}
                            className="IncruitList_searchSelect"
                        >
                            <option value="ititle">제목</option>
                            <option value="iwriter">작성자</option>
                        </select>

                        {/* 검색 입력 필드 */}
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="검색어를 입력하세요"
                            className="IncruitList_searchInput"
                        />

                        {/* 검색 버튼 */}
                        <button onClick={handleSearchClick} className="IncruitList_searchButton">
                            검색
                        </button>
                    </div>

                    {!isAdmin && (
                        <div className="IncruitList_buttons">
                            {/* isLeader가 true일 경우에만 모집글 작성 버튼을 표시 */}
                            {isLeader && (
                                <button
                                    className="IncruitList_button"
                                    onClick={handleCreateClick}
                                >
                                    모집글 작성
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <ul className="IncruitList_ul">
                    {currentItems.map((incruit) => (
                        <li key={incruit.ino} className="IncruitList_li">
                            <Link to={`/incruit/${incruit.ino}`} className="IncruitList_link"
                                onClick={() => handleViewClick(incruit.ino)}>
                                {incruit.ititle} - {incruit.iwriter} (조회수: {incruit.iviews})
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* 페이지네이션 버튼 */}
                <div className="IncruitList_pagination">
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

export default IncruitList;
