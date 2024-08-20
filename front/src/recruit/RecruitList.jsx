import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecruitList = () => {
  const [recruits, setRecruits] = useState([]);
  const [counts, setCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [filteredRecruits, setFilteredRecruits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recruitsPerPage] = useState(10)
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/recruit/list')
      .then(response => {
        setRecruits(response.data);
        setFilteredRecruits(response.data); // 초기에는 전체 리스트 표시

        // 각 모집 게시글에 대해 신청 인원을 가져오는 추가 API 호출
        response.data.forEach(recruit => {
          axios.get('http://localhost:8080/apply/count', { params: { rno: recruit.rno } })
            .then(countResponse => {
              setCounts(prevCounts => ({
                ...prevCounts,
                [recruit.rno]: countResponse.data
              }));
            })
            .catch(error => {
              console.error('There was an error fetching the recruit count!', error);
            });
        });
      })
      .catch(error => {
        console.error('There was an error fetching the recruit list!', error);
      });
  }, []);

  const handleRowClick = (rno) => {
    navigate(`/recruit/read/${rno}`);
  };

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // 'en-CA' 형식을 사용하면 'yyyy-mm-dd'로 표시됩니다.
  };

  // 배열로 이루어져 있는 날짜/시간 데이터의 표시 형식을 변환하는 법
  // const formatDate = (dateArray) => {
  //     const [year, month, day] = dateArray;
  //     return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  // };

  // 시간 형식 변환 함수
  const formatTime = (timeArray) => {
    const [hour, minute] = timeArray;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  const handleRecruitRegister = () => {
    navigate('/recruit/register')
  };

  // 검색 버튼 클릭 시 필터링 수행
  const handleSearch = () => {
    const filtered = recruits.filter(recruit => {
      if (searchType === "title") {
        return recruit.r_title.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType === "content") {
        return recruit.r_content.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType === "writer") {
        return recruit.r_writer.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return false;
      }
    });
    setFilteredRecruits(filtered);
    setCurrentPage(1); // 검색 시 페이지를 첫 페이지로 리셋
  };

  // 페이지 변경 핸들러
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 현재 페이지에 해당하는 모집글 계산
  const indexOfLastRecruit = currentPage * recruitsPerPage;
  const indexOfFirstRecruit = indexOfLastRecruit - recruitsPerPage;
  const currentRecruits = filteredRecruits.slice(indexOfFirstRecruit, indexOfLastRecruit);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredRecruits.length / recruitsPerPage);

  return (
    <div>
      <h1>Recruit List</h1>
      <button type="button" onClick={handleRecruitRegister}>게시글 등록</button>
      <div style={{ marginBottom: '10px' }}>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        >
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="writer">작성자</option>
        </select>

        <input
          type="text"
          placeholder="검색어 입력"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px', padding: '5px', width: '300px' }}
        />

        <button type="button" onClick={handleSearch}>검색</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>rno</th>
            <th>Title</th>
            <th>Content</th>
            <th>Place</th>
            <th>Date</th>
            <th>Time</th>
            <th>Max Number</th>
          </tr>
        </thead>
        <tbody>
          {recruits.map(recruit => (
            <tr key={recruit.rno} onClick={() => handleRowClick(recruit.rno)}>
              <td>{recruit.rno}</td>
              <td>{recruit.r_title}</td>
              <td>{recruit.r_content}</td>
              <td>{recruit.r_place2}</td>
              <td>{formatDate(recruit.r_date)}</td>
              <td>{formatTime(recruit.r_time)}</td>
              <td>{counts[recruit.rno] !== undefined ? counts[recruit.rno] : 'Loading...'}/{recruit.max_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 페이지네이션 UI */}
      <div style={{ marginTop: '20px' }}>
        {[...Array(totalPages).keys()].map(pageNumber => (
          <button
            key={pageNumber + 1}
            onClick={() => paginate(pageNumber + 1)}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              backgroundColor: currentPage === (pageNumber + 1) ? '#007bff' : '#f8f9fa',
              color: currentPage === (pageNumber + 1) ? '#fff' : '#000',
              border: '1px solid #007bff',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {pageNumber + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default RecruitList;