import axios from "axios";
import { useEffect, useState } from "react";
import NoticeDetail from "./NoticeDetail";
import NoticeRegister from "./NoticeRegister";

function Noticelist() {
  const [noticeList, setNoticeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currentItems, setCurrentItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const uploadRegister = async () => {
    try {
      const result = await axios.get("http://localhost:8080/notice/list");
      setNoticeList(result.data);
    } catch (error) {
      console.error("Error fetching notice list:", error);
    }
  };

  useEffect(() => {
    uploadRegister();
  }, []);

  useEffect(() => {
    const filteredList = noticeList.filter(notice =>
      notice.n_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // 역순 정렬
    const reversedList = filteredList.slice().reverse();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(reversedList.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, itemsPerPage, noticeList, searchTerm]);

  const totalPages = Math.ceil(
    noticeList.filter(notice =>
      notice.n_title.toLowerCase().includes(searchTerm.toLowerCase())
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
    if (!dateStr) return 'Date not available';

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid Date';

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

  const handleNoticeClick = (nno) => {
    setSelectedNotice(nno);
  };

  return (
    <div className="container notice_con">
      {showRegister ? (
        <NoticeRegister />
      ) : selectedNotice ? (
        <NoticeDetail nno={selectedNotice} />
      ) : (
        <>
          <div className="d-flex justify-content-between mb-4">
            <h2 className="notice_title" style={{ fontSize: "30px" }}>공지사항</h2>
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
              {currentItems.map((notice, index) => (
                <tr key={index}>
                  <th scope="row">{notice.nno}</th>
                  <td onClick={() => handleNoticeClick(notice.nno)} style={{ cursor: 'pointer' }}>
                    {notice.n_title}
                  </td>
                  <td className="NoticeView_p">
                  {new Date(notice.regDate[0], notice.regDate[1] - 1, notice.regDate[2], notice.regDate[3], notice.regDate[4], notice.regDate[5]).toLocaleDateString()}
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
                className="btn btn-outline-dark noticeRegisterBtn"
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

export default Noticelist;
