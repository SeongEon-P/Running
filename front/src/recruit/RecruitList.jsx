import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const RecruitList = () => {
  const [recruits, setRecruits] = useState([]);
  const [counts, setCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = 10; // 페이지당 아이템 수

  useEffect(() => {
    // 페이지 복귀 시 전달된 상태로 currentPage 설정
    const pageFromState = location.state?.page;
    if (pageFromState) {
      setCurrentPage(pageFromState);
    } else {
      fetchRecruits(currentPage);
    }
  }, [location.state]);

  useEffect(() => {
    fetchRecruits(currentPage);
  }, [currentPage]);

  const fetchRecruits = (page) => {
    axios.get('http://localhost:8080/recruit/list', {
      params: {
        page: page - 1,
        size: itemsPerPage
      }
    })
      .then(response => {
        setRecruits(response.data.content);
        setTotalPages(response.data.totalPages);
        setCounts({}); // 페이지 이동 시 기존 counts 초기화

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
  };

  const handleRowClick = (rno) => {
    navigate(`/recruit/read/${rno}`, { state: { page: currentPage } }); // 현재 페이지 상태 전달
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
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage); // 페이지 번호 변경
  }

  return (
    <div>
      <h1>Recruit List</h1>
      <button type="button" onClick={handleRecruitRegister}>게시글 등록</button>
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
              <td>{recruit.title}</td>
              <td>{recruit.content}</td>
              <td>{recruit.place}</td>
              <td>{formatDate(recruit.date)}</td>
              <td>{formatTime(recruit.time)}</td>
              <td>{counts[recruit.rno] !== undefined ? counts[recruit.rno] : 'Loading...'}/{recruit.maxnumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            disabled={currentPage === index + 1}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default RecruitList;