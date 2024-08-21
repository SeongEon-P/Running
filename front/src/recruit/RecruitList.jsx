import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Sidebar from '../components/Sidebar/Sidebar';
import './RecruitList.css';

const RecruitList = () => {
  const [recruits, setRecruits] = useState([]);
  const [counts, setCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCategory, setSearchCategory] = useState('title');
  const recruitsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/recruit/list')
      .then(response => {
        const sortedRecruits = response.data.sort((a, b) => b.rno - a.rno);
        setRecruits(sortedRecruits);

        sortedRecruits.forEach(recruit => {
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

  const handleSearch = () => {
    axios.get('http://localhost:8080/recruit/list', {
      params: {
        searchKeyword,
        searchCategory
      }
    })
      .then(response => {
        const sortedRecruits = response.data.sort((a, b) => b.rno - a.rno);
        setRecruits(sortedRecruits);
        setCurrentPage(0);
      })
      .catch(error => {
        console.error('There was an error searching the recruit list', error);
      });
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');
  };

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

  const offset = currentPage * recruitsPerPage;
  const currentRecruits = recruits.slice(offset, offset + recruitsPerPage);

  return (
    <div className="recruit-page">
      <Sidebar />
      <div className="recruit-content">
        <h1>Recruit List</h1>
        <div>
          <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="memberRecruit.mid">작성자</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button type="button" onClick={handleSearch}>검색</button>
        </div>
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
          previousLabel={"이전"}
          nextLabel={"다음"}
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
    </div>
  );
}

export default RecruitList;
