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
  const [searchType, setSearchType] = useState("all");
  const [showRegister, setShowRegister] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

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
    const lowerSearchTerm = searchTerm ? searchTerm.toLowerCase() : "";
    const filteredList = reviewList
      .filter(review => {
        const title = review.r_title ? review.r_title.toLowerCase() : "";
        const content = review.r_content ? review.r_content.toLowerCase() : "";
        const writer = review.writer ? review.writer.toLowerCase() : "";

        switch (searchType) {
          case "title":
            return title.includes(lowerSearchTerm);
          case "content":
            return content.includes(lowerSearchTerm);
          case "writer":
            return writer.includes(lowerSearchTerm);
          case "all":
          default:
            return (
              title.includes(lowerSearchTerm) ||
              content.includes(lowerSearchTerm) ||
              writer.includes(lowerSearchTerm)
            );
        }
      })
      .sort((a, b) => {
        // Sort by date in descending order
        const dateA = new Date(a.regDate[0], a.regDate[1] - 1, a.regDate[2], a.regDate[3], a.regDate[4], a.regDate[5]);
        const dateB = new Date(b.regDate[0], b.regDate[1] - 1, b.regDate[2], b.regDate[3], b.regDate[4], b.regDate[5]);
        return dateB - dateA; // Descending order
      });

    const totalItems = filteredList.length;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

    setCurrentItems(currentItems);
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [currentPage, itemsPerPage, reviewList, searchTerm, searchType]);

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

  const handleSearch = () => {
    setSearchTerm(document.getElementById('searchInput').value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
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
            <h2 className="review_title" style={{ fontSize: "30px" }}>리뷰</h2>
            <div className="d-flex">
              <select className="form-select me-2" onChange={handleSearchTypeChange} value={searchType}>
                <option value="all">전체</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="writer">작성자</option>
              </select>
              <input
                id="searchInput"
                className="form-control me-2"
                type="text"
                placeholder="검색..."
              />
              <button
                className="btn btn-outline-dark"
                type="button"
                onClick={handleSearch}
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
                  <td
                     onClick={() => handleReviewClick(review.rno)}
                     style={{ cursor: 'pointer' }}>
                    {review.r_title}
                  </td>
                  <td className="ReviewView_p">
                    {new Date(review.regDate[0], review.regDate[1] - 1, review.regDate[2], review.regDate[3], review.regDate[4], review.regDate[5]).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="mx-auto">
              {renderPageNumbers()}
            </div>
            <div className="text-end">
              <button
                type="button"
                className="btn btn-outline-dark reviewRegisterBtn"
                onClick={handleRegisterClick}
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
