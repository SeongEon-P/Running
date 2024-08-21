import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const RecruitList = () => {
  const [recruits, setRecruits] = useState([]);
  const [counts, setCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const recruitsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/recruit/list')
      .then(response => {
        console.log('Recruit List:', response.data); // 데이터가 배열인지 확인
        setRecruits(response.data);

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
    navigate(`/recruit/read/${rno}`, { state: { currentPage } });
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

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // 현재 페이지에 해당하는 모집 정보만 추출
  const offset = currentPage * recruitsPerPage;
  const currentRecruits = recruits.slice(offset, offset + recruitsPerPage);


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
          {currentRecruits.map(recruit => (
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
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={Math.ceil(recruits.length / recruitsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
    </div>
  )
}

export default RecruitList;