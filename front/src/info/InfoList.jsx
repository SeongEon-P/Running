import axios from "axios";
import InfoRegister from "./InfoRegister";
import InfoDetail from "./InfoDetail";
import { useEffect, useState } from "react";

function InfoList(){
  const [infoList, setInfoList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currentItems, setCurrentItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [showRegister, setShowRegister] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const uploadRegister = async () => {
    try {
      const result = await axios.get("http://localhost:8080/info/list");
      setInfoList(result.data);
    } catch (error) {
      console.error("Error fetching info list:", error);
    }
  };

  useEffect(() => {
    uploadRegister();
  }, []);

  useEffect(() => {
    const lowerSearchTerm = searchTerm ? searchTerm.toLowerCase() : "";
    const filteredList = infoList
      .filter(info => {
        const title = info.i_title ? info.i_title.toLowerCase() : "";
        const content = info.i_content ? info.i_content.toLowerCase() : "";
        const writer = info.writer ? info.writer.toLowerCase() : "";
  
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
  
      const importantInfos = filteredList.filter(info => info.important === true);
      const regularInfos = filteredList.filter(info => info.important !== true).reverse(); // 역순 정렬
  
      const totalItems = importantInfos.length + regularInfos.length;
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const paginatedRegularInfos = regularInfos.slice(indexOfFirstItem, indexOfLastItem);
  
      // 중요 공지사항을 맨 위에 표시
      const currentItems = [...importantInfos, ...paginatedRegularInfos];
  
    // 현재 페이지 항목 설정 및 전체 페이지 수 설정
    setCurrentItems(currentItems);
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [currentPage, itemsPerPage, infoList, searchTerm, searchType]);
  
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

  const handleInfoClick = (ino) => {
    setSelectedInfo(ino);
  };

  return (
    <div className="container info_con">
      {showRegister ? (
        <InfoRegister />
      ) : selectedInfo ? (
        <InfoDetail ino={selectedInfo} />
      ) : (
        <>
          <div className="d-flex justify-content-between mb-4">
            <h2 className="info_title" style={{ fontSize: "30px" }}>Info</h2>
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
              {currentItems.map((info, index) => (
                <tr key={index}>
                  <th scope="row">{info.ino}</th>
                  <td 
                    onClick={() => handleInfoClick(info.ino)} 
                    style={{ cursor: 'pointer' }}
                  >
                    {info.important === true && <strong>[중요]</strong>}
                    {info.i_title}
                  </td>
                  <td className="InfoView_p">
                    {new Date(info.regDate[0], info.regDate[1] - 1, info.regDate[2], info.regDate[3], info.regDate[4], info.regDate[5]).toLocaleDateString()}
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
                className="btn btn-outline-dark infoRegisterBtn"
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
export default InfoList;