import axios from "axios";
import { useEffect, useState } from "react";
import NoticeDetail from "./NoticeDetail";
import NoticeRegister from "./NoticeRegister";
import './Noticelist.css'

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
    const lowerSearchTerm = searchTerm ? searchTerm.toLowerCase() : "";
    const filteredList = noticeList
      .filter(notice => {
        const title = notice.n_title ? notice.n_title.toLowerCase() : "";
        const content = notice.n_content ? notice.n_content.toLowerCase() : "";
        const writer = notice.writer ? notice.writer.toLowerCase() : "";
  
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
      .sort((a, b) => b.is_important - a.is_important || b.nno - a.nno);
  
    // 전체 항목 수 계산
    const totalItems = filteredList.length;
  
    // 페이지네이션에 따른 현재 페이지의 항목들 설정
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  
    // 현재 페이지 항목 설정 및 전체 페이지 수 설정
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
  

  const handleSearch = () => {
    setSearchTerm(document.getElementById('searchInput').value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
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
              {currentItems.map((notice, index) => (
                <tr key={index}>
                  <th scope="row">{notice.nno}</th>
                  <td 
                    onClick={() => handleNoticeClick(notice.nno)} 
                    style={{ cursor: 'pointer' }}
                  >
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
