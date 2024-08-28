import React, { useEffect, useState } from "react";
import axios from "axios";
import NoticeDetail from "./NoticeDetail";
import NoticeRegister from "./NoticeRegister";
import './Noticelist.css';
import Sidebar from "../components/Sidebar/Sidebar";
import searchBl from '../assets/img_src/search_bl.png';
import searchWh from '../assets/img_src/search_wh.png';

function Noticelist() {
  const [noticeList, setNoticeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currentItems, setCurrentItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [showRegister, setShowRegister] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchIcon, setSearchIcon] = useState(searchBl);  // 상태로 이미지 관리

  const fetchNotices = async () => {
    try {
      const result = await axios.get("http://localhost:8080/notice/list");
      setNoticeList(result.data);
    } catch (error) {
      console.error("Error fetching notice list:", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem('login'));
    setIsAdmin(loginData && loginData.mid === "admin");
  }, []);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filteredList = noticeList
      .filter(notice => {
        const title = notice.n_title.toLowerCase();
        const content = notice.n_content.toLowerCase();
        const writer = notice.writer.toLowerCase();

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
      });

    const importantNotices = filteredList.filter(notice => notice.important);
    const regularNotices = filteredList.filter(notice => !notice.important).reverse();

    const totalItems = importantNotices.length + regularNotices.length;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedRegularNotices = regularNotices.slice(indexOfFirstItem, indexOfLastItem);

    const currentItems = [...importantNotices, ...paginatedRegularNotices];

    setCurrentItems(currentItems);
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [currentPage, itemsPerPage, noticeList, searchTerm, searchType]);

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

  // handleRegisterClick 함수 정의
  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  // handleNoticeClick 함수 정의
  const handleNoticeClick = (nno) => {
    setSelectedNotice(nno);
  };

  const handleSearch = () => {
    setSearchTerm(document.getElementById('searchInput').value);
    setCurrentPage(1); // 검색 시 페이지를 1로 초기화
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container notice_con flex-grow-1">
        {showRegister ? (
          <NoticeRegister />
        ) : selectedNotice ? (
          <NoticeDetail nno={selectedNotice} />
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="notice_title">공지사항</h2>
              <div className="search-container d-flex align-items-center">
                <select className="form-select me-2" onChange={handleSearchTypeChange} value={searchType}>
                  <option value="all">전체</option>
                  <option value="title">제목</option>
                  <option value="content">내용</option>
                  <option value="writer">작성자</option>
                </select>
                <input
                  id="searchInput"
                  className="form-control"
                  type="text"
                  placeholder="검색..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  className="custom-search-btn"
                  type="button"
                  onClick={handleSearch}
                  onMouseEnter={() => setSearchIcon(searchWh)}  // 마우스 오버 시 이미지 변경
                  onMouseLeave={() => setSearchIcon(searchBl)}  // 마우스가 버튼을 벗어나면 원래 이미지로 변경
                  style={{
                    backgroundImage: `url(${searchIcon})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: '50%', // 이미지 크기를 줄임
                  }}
                >
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    className="btn btn-outline-dark noticeRegisterBtn"
                    onClick={handleRegisterClick}
                  >
                    등록
                  </button>
                )}
              </div>
            </div>


            <table className="table table-hover mb-4">
              <thead>
                <tr>
                  <th scope="col">번호</th>
                  <th scope="col">제목</th>
                  <th scope="col">등록일</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((notice, index) => (
                  <tr key={index} onClick={() => handleNoticeClick(notice.nno)}>
                    <th scope="row">{notice.nno}</th>
                    <td>
                      {notice.important && <span className="important-notice">[중요] </span>}
                      {notice.n_title}
                    </td>
                    <td>
                      {notice.regDate ?
                        new Date(notice.regDate[0], notice.regDate[1] - 1, notice.regDate[2], notice.regDate[3], notice.regDate[4], notice.regDate[5]).toLocaleDateString() :
                        "날짜 정보 없음"}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="mx-auto">
                {renderPageNumbers()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Noticelist;
