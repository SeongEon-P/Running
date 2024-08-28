import axios from "axios";
import { useEffect, useState } from "react";
import Noticelist from "./Noticelist";
import NoticeDetail from "./NoticeDetail";
import './NoticeRegister.css'

const NoticeRegister = () => {
    const [notice, setNotice] = useState({
        n_title: "",
        n_content: "",
        writer: "",
        is_important: false,
    });
    const [nr_files, setNrFiles] = useState([]);
    const [showNoticeList, setShowNoticeList] = useState(false);
    const [showNoticeDetail, setShowNoticeDetail] = useState(false);
    const [registeredNno, setRegisteredNno] = useState(null);

    const onInputChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        if (name === "nr_files") {
            setNrFiles([...files]); // 여러 파일을 배열로 저장
        } else if (type === "checkbox") {
            setNotice({
                ...notice,
                [name]: checked,
            });
        } else {
            setNotice({
                ...notice,
                [name]: value,
            });
        }
    };

    useEffect(() => {
        const loginData = JSON.parse(localStorage.getItem('login'));
        if (loginData && loginData.name) {
            setNotice(prevData => ({
                ...prevData,
                writer: loginData.name
            }));
        }
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formData = new FormData();
            formData.append("n_title", notice.n_title);
            formData.append("n_content", notice.n_content);
            formData.append("writer", notice.writer);
            formData.append("is_important", notice.is_important); // boolean 값 처리
    
            if (nr_files.length > 0) {
                nr_files.forEach((file) => {
                    formData.append("files", file);
                });
            }
    
            // FormData의 내용을 콘솔에 출력
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
    
            const response = await axios.post("http://localhost:8080/notice/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status === 201) {
                alert("공지사항 등록이 성공적으로 완료되었습니다.");
                setRegisteredNno(response.data.nno);
                setShowNoticeDetail(true);
            }
        } catch (error) {
            console.error("등록 중 오류가 발생했습니다.", error);
            alert("등록 중 오류가 발생했습니다.");
        }
    };
    
    const handleListClick = () => {
        setShowNoticeList(true);
    };

    return (
        <>
            {showNoticeList ? (
                <Noticelist />
            ) : showNoticeDetail ? (
                <NoticeDetail nno={registeredNno} />
            ) : (
                <>
                    <h2 className="notice">공지사항 등록</h2>
                    <form onSubmit={onSubmit}>
                        <div className="container">
                            <div className="d-flex flex-wrap justify-content-between">
                                <p className="d-flex notice_title">제목:
                                    <input
                                        onChange={onInputChange}
                                        type="text"
                                        name="n_title"
                                        className="form-control"
                                        value={notice.n_title}
                                        required
                                        placeholder="제목"
                                    />
                                </p>
                                <span>작성자 : {notice.writer}</span>
                            </div>
                            <p className="notice_content">내용
                                <textarea
                                    onChange={onInputChange}
                                    id="n_content"
                                    className="form-control"
                                    placeholder="내용"
                                    name="n_content"
                                    value={notice.n_content}
                                    rows="20"
                                />
                            </p>
                            <p>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="is_important"
                                        checked={notice.is_important}
                                        onChange={onInputChange}
                                    />
                                    중요 공지사항
                                </label>
                            </p>
                            <p>첨부파일</p>
                            <input
                                onChange={onInputChange}
                                type="file"
                                id="nr_files"
                                className="form-control"
                                name="nr_files"
                                multiple // 다중 파일 업로드를 허용
                            />
                        </div>
                        
                        <div className="d-flex flex-wrap justify-content-between btns">
                            <button className="btn btn-outline-dark noticeListBtn" onClick={handleListClick}>목록으로 돌아가기</button>
                                <button type="submit" className="btn btn-outline-primary px-3 mx-2">
                                    등록
                                </button>
                        </div>
                    </form>
                </>
            )}
        </>
    );
};

export default NoticeRegister;