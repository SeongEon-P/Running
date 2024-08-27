import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import Noticelist from "./Noticelist";
import NoticeModify from "./NoticeModify";

const NoticeDetail = ({ nno }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState({});
    const [noticeResource, setNoticeResource] = useState([]);
    const [showModify, setShowModify] = useState(false);
    const [showList, setShowList] = useState(false);

    const getNoice = async () => {
        const response = await (await axios.get(`http://localhost:8080/notice/read?nno=${nno}`)).data;
        setNotice(response);
        setNoticeResource(response.notice_resource);
        setLoading(false);
    };
    const handleModify = () => {
        setShowModify(true);
    }
    const handleDelete = async () => {
        if (window.confirm(`${notice.nno}번의 공지사항을 삭제 하시겠습니까?`))
            try {
                await axios.delete(`http://localhost:8080/notice/${nno}`)
                console.log(`${notice.nno} 공지사항 삭제 완료`);
                alert(`${notice.nno}가 삭제되었습니다.`);
                setShowList(true);
            } catch (error) {
                console.log('삭제중 오류발생', error);
                alert('삭제중 오류가 발생했습니다.')
            };
    };
    useEffect(() => {
        getNoice();
    }, [nno, showModify]);

    const formatDate = (dateStr) => {
        if (!dateStr) {
            return 'Date Not available';
        }
        const data = new Date(dateStr);
        if (isNaN(data.getTime())) {
            console.warn(`Invalid date: ${dateStr}`);
            return 'Invalid Date';
        }
        const year = data.getFullYear();
        const month = String(data.getMonth() + 1).padStart(2, '0');
        const day = String(data.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : showList ? (
                <Noticelist />
            ) : showModify ? (
                <NoticeModify nno={nno} setShowModify={setShowModify} setShowDetail={() => setShowList(false)} />
            ) : (
                <>
                    <h2 className="notice">공지사항</h2>
                    <div className="container">
                        <div className="form-control">
                            <div className="d-flex flex-wrap justify-content-between">
                                <span className="notice_title">{notice.n_title}</span>
                                <span>작성자 : {notice.writer}</span>
                            </div>
                        </div>
                        <div className="form-control">
                            <span> 등록일 : {formatDate(notice.regDate)} </span>
                        </div>
                        <div className="form-control">
                            <pre className="notice_content">{notice.n_content}</pre>
                        </div>
                        <div className="form-control">
                            {noticeResource.map((nr, index) => (
                                <p key={index}>
                                    <a href={'http://localhost:8080/file/' + nr.nr_name}>{nr.nr_name}</a>
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="d-flex flex-wrap justify-content-between btns">
                        <button
                          className="btn btn-outline-dark noticeListBtn"
                          onClick={() =>setShowList(true)}>
                            목록으로 가기
                          </button>
                          <div className="">
                            <button className="btn btn-outline-primary noticeModifyBtn" onClick={handleModify}>수정</button>
                            <button className="btn btn-outline-danger noticeRemoveBtn" onClick={handleDelete}>삭제</button>
                          </div>
                    </div>
                </>
            )}
        </>
    );

};

export default NoticeDetail;