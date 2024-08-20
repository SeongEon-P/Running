import axios from "axios";
import { useEffect, useState } from "react";

const NoticeModify = ({ nno, setShowModify, setShowDetail }) => {
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState({
        n_title: "",
        n_content: "",
        writer: localStorage.getItem('mid') || "",
    });
    const [noticeResource, setNoticeResource] = useState([]);
    const [files, setFiles] = useState([]);

    const onInputChange = (e) => {
        const { name, value, files: selectedFiles } = e.target;
        if (name === "files") {
            setFiles(Array.from(selectedFiles));
        } else {
            setNotice({
                ...notice,
                [name]: value,
            });
        }
    };

    const getNotice = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/notice/read?nno=${nno}`);
            console.log(response.data);
            setNotice(response.data);
            setNoticeResource(response.data.notice_resource);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching notice:", error);
        }
    };

    const deleteSubmit = async (nrno) => {
        if (window.confirm('삭제하시겠습니까?')) {
            try {
                await axios.delete(`http://localhost:8080/notice/files/${nrno}`);
                setNoticeResource(noticeResource.filter(nr => nr.nrno !== nrno));
            } catch (error) {
                console.error("파일을 삭제하는 중 오류가 발생했습니다.", error);
            }
        }
    };

    useEffect(() => {
        getNotice();
    }, [nno]);

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("n_title", notice.n_title);
            formData.append("n_content", notice.n_content);
            formData.append("writer", notice.writer);

            files.forEach(file => {
                formData.append("files", file);
            });

            const response = await axios.put(`http://localhost:8080/notice/${nno}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                alert("공지사항 수정이 성공적으로 완료되었습니다.");
                setShowModify(false);
                setShowDetail(true);
            }
        } catch (error) {
            console.error("수정 중 오류가 발생했습니다.", error);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <h2 className="notice">수정중</h2>
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
                    <p>첨부파일</p>
                    <input
                        onChange={onInputChange}
                        type="file"
                        id="files"
                        className="form-control"
                        name="files"
                        multiple // Allow multiple file selection
                    />
                    {noticeResource.map((nr) => (
                        <div key={nr.nrno}>
                            <p>{nr.nr_name} <button type="button" onClick={() => deleteSubmit(nr.nrno)}>X</button></p>
                        </div>
                    ))}
                </div>
                <div className="d-flex flex-wrap justify-content-between btns">
                    <button type="button" className="btn btn-outline-dark noticeListBtn" onClick={() => setShowModify(false)}>수정 취소</button>
                    <div>
                        <button type="submit" className="btn btn-outline-primary px-3 mx-2">수정</button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default NoticeModify;
