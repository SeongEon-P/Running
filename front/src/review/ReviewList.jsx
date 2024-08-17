import axios from "axios";
import { useEffect, useState } from "react";
import ReviewDetail from "./ReviewDetail";
import ReviewRegister from "./ReviewRegister";

function ReviewList() {
  const [reviewList, setReviewList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currentItems, setCurrentItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);


  const uploadRegister = async () => {
    try {
        const result = await axios.get("http://localhost:8080/review/list");
        console.log(result.data);
        setReviewList(result.data);
    } catch (error) {
      console.error("Error fetching review list:", error);
    }
  };

  useEffect(() => {
    uploadRegister();
  }, []);

  useEffect(() => {
    const filteredList = reviewList.filter(review =>
      review.r_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(filteredList.slice(indexOfFirstItem, indexOfLastItem).reverse());
  }, [currentPage, itemsPerPage, reviewList, searchTerm]);

  const totalPages = Math.ceil(
    reviewList.filter(review =>
      review.r_title.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / itemsPerPage
  );

  const maxPageNumbers = 5;

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    let endPage = startPage + maxPageNumbers - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageNumbers + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? 'active' : ''}`}
        >
          <a
            className="page-link"
            onClick={() => handleClick(i)}
            style={{ cursor: 'pointer' }}
          >
            {i}
          </a>
        </li>
      );
    }

    return (
      <ul className="pagination mb-0">
        {startPage > 1 && (
          <li className="page-item">
            <a
              className="page-link"
              onClick={() => handleClick(startPage - 1)}
              style={{ cursor: 'pointer' }}
            >
              &laquo;
            </a>
          </li>
        )}
        {pageNumbers}
        {endPage < totalPages && (
          <li className="page-item">
            <a
              className="page-link"
              onClick={() => handleClick(endPage + 1)}
              style={{ cursor: 'pointer' }}
            >
              &raquo;
            </a>
          </li>
        )}
      </ul>
    );
  };

  const formatDate = (dateStr) => {
    console.log(`Date String: ${dateStr}`); // 날짜 문자열 확인
  
    if (!dateStr) {
      return 'Date not available';
    }
  
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date: ${dateStr}`);
      return 'Invalid Date';
    }
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const handleSearch = () => {
    setSearchTerm(document.getElementById('searchInput').value);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  const handleReviewClick = (rno) => {
    setSelectedReview(rno);
  };

  return (
    <div className="container review_con">
      {showRegister ? ( 
        <ReviewRegister />
      ) : selectedReview ? ( 
        <ReviewDetail rno={selectedReview} />
      ) : (
        <>
          <div className="d-flex justify-content-between mb-4">
            <h2 className="review_title" style={{ fontSize: "30px" }}>공지사항</h2>
            <div className="d-flex">
              <input
                id="searchInput"
                className="form-control me-2"
                type="text"
                placeholder="검색..."
              />
              <button 
                className="btn btn-outline-dark"
                type="button"
                onClick={handleSearch} // 검색 버튼 클릭 시 handleSearch 호출
              >
                Search
              </button>
            </div>
          </div>

          <table className="table table-hover border shadow-sm mb-4">
            <thead>
              <tr>
                <th scope="col">번호</th>
                <th scope="col">제목</th>
                <th scope="col">등록일</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((review, index) => (
                <tr key={index}>
                  <th scope="row">{review.rno}</th>
                  <td onClick={() => handleReviewClick(review.rno)} style={{ cursor: 'pointer' }}>
                    {review.r_title}
                  </td>
                  <td>{formatDate(review.regdate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="mx-auto"> {/* 페이지 번호를 가운데로 정렬 */}
              {renderPageNumbers()}
            </div>
            <div className="text-end">
              <button
                type="button"
                className="btn btn-outline-dark reviewRegisterBtn"
                onClick={handleRegisterClick} // 등록 버튼 클릭 시 handleRegisterClick 호출
              >
                등록
              </button>
            </div>
          </div>
        </>
      )}
    </div>

  );
}

export default ReviewList;
