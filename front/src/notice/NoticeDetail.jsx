import axios from "axios";
import { useEffect, useState } from "react";
import Noticelist from "./Noticelist";
import NoticeModify from "./NoticeModify";
import './NoticeDetail.css';

const NoticeDetail = ({ nno }) => {
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState({});
    const [noticeResources, setNoticeResources] = useState([]);
    const [showModify, setShowModify] = useState(false);
    const [showList, setShowList] = useState(false);
    const [currentUser, setCurrentUser] = useState(""); // Current user state

    const getNotice = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/notice/read?nno=${nno}`);
            setNotice(response.data);
            setNoticeResources(response.data.notice_resource || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching notice details", error);
        }
    };

    useEffect(() => {
        // Fetch current user info from localStorage
        const user = JSON.parse(localStorage.getItem('login'));
        if (user) {
            setCurrentUser(user.name); // Set current user
        }
    }, []);

    const handleModify = () => {
        setShowModify(true);
    };

    const handleDelete = async () => {
        if (window.confirm(`${notice.nno}번의 공지사항을 삭제 하시겠습니까?`)) {
            try {
                await axios.delete(`http://localhost:8080/notice/${nno}`);
                console.log(`${notice.nno} 공지사항 삭제 완료`);
                alert(`${notice.nno}가 삭제되었습니다.`);
                setShowList(true);
            } catch (error) {
                console.error('삭제중 오류발생', error);
                alert('삭제중 오류가 발생했습니다.');
            }
        }
    };

    useEffect(() => {
        getNotice();
    }, [nno, showModify]);

    const canModifyOrDelete = notice.writer === currentUser;

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : showList ? (
                <Noticelist />
            ) : showModify ? (
                <NoticeModify nno={nno} setShowModify={setShowModify} setShowDetail={() => setShowList(false)} />
            ) : (
                <div className="container">
                    <h2 className="notice_title">공지사항</h2>
                    <div className="form-control">
                        <div className="d-flex flex-wrap justify-content-between">
                            <p className="notice_title">
                                {notice.n_title}
                                {notice.is_important && <span className="important-tag">[중요]</span>}
                            </p>
                            <span>작성자: {notice.writer}</span>
                        </div>
                    </div>
                    <div className="form-control">
                        <p className="IncruitView_p">
                            등록일: {new Date(notice.regDate[0], notice.regDate[1] - 1, notice.regDate[2], notice.regDate[3], notice.regDate[4], notice.regDate[5]).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="form-control">
                        <p className="notice_content">내용: {notice.n_content}</p>
                        {noticeResources.length > 0 ? (
                            noticeResources.map((resource, index) => (
                                <div key={index} style={{ marginBottom: '15px' }}>
                                    {resource.nr_type.startsWith("image") ? (
                                        <img
                                            src={`http://localhost:8080/notice/files/${resource.nr_name}`}
                                            alt={resource.nr_name}
                                        />
                                    ) : (
                                        <p>
                                            <a href={`http://localhost:8080/notice/files/${resource.nr_name}`}>
                                                {resource.nr_name}
                                            </a>
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>첨부 파일이 없습니다.</p>
                        )}
                    </div>
                    <div className="d-flex flex-wrap justify-content-between btns">
                        <button
                            className="btn btn-outline-dark noticeListBtn"
                            onClick={() => setShowList(true)}>
                            목록으로 가기
                        </button>
                            {canModifyOrDelete && (
                                <>
                                    <button className="btn noticeModifyBtn" onClick={handleModify}>
                                        수정
                                    </button>
                                    <button className="btn noticeRemoveBtn" onClick={handleDelete}>
                                        삭제
                                    </button>
                                </>
                            )}
                    </div>
                </div>
            )}
        </>
    );
};

export default NoticeDetail;