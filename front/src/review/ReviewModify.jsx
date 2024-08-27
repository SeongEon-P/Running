import { type } from "@testing-library/user-event/dist/type";
import axios from "axios";
import { useEffect, useState } from "react";

const ReviewModify = ({ rno, setShowModify, setShowDetail }) => {
    const [loading, setLoading] = useState(true);
    const [review, setReview] = useState({
        r_title: "",
        r_content: "",
        writer: localStorage.getItem('mid') || "",
        is_important: false,
    });
    const [reviewResource, setReviewResource] = useState([]);
    const [files, setFiles] = useState([]);

    const onInputChange = (e) => {
        const { name, value, files: selectedFiles, type, checked } = e.target;
        if (name === "files") {
            setFiles(Array.from(selectedFiles));
        } else if (type === "checkbox"){
            setReview({
                ...review,
                [name]: checked,
            });
        } else {
            setReview({
                ...review,
                [name]: value,
            });
        }
    };

    useEffect(() => {
        const loginData = JSON.parse(localStorage.getItem('login'));
        if (loginData && loginData.name) {
            setReview(prevData => ({
                ...prevData,
                writer: loginData.name
            }));
        }
    }, []);

    const getReview = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/review/read?rno=${rno}`);
            console.log(response.data);

            if (!response.data.writer) {
                console.warn("Fetched review has no writer field!");
            }

            setReview(response.data);
            setReviewResource(response.data.review_resource);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching review:", error);
        }
    };

    const deleteSubmit = async (rrno) => {
        if (window.confirm('삭제하시겠습니까?')) {
            try {
                await axios.delete(`http://localhost:8080/review/files/${rrno}`);
                setReviewResource(reviewResource.filter(rr => rr.rrno !== rrno));
            } catch (error) {
                console.error("파일을 삭제하는 중 오류가 발생했습니다.", error);
            }
        }
    };

    useEffect(() => {
        getReview();
    }, [rno]);

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("r_title", review.r_title);
            formData.append("r_content", review.r_content);
            formData.append("writer", review.writer);
            formData.append("is_important", review.is_important);

            files.forEach(file => {
                formData.append("files", file);
            });

            const response = await axios.put(`http://localhost:8080/review/${rno}`, formData, {
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
            <h2 className="review">수정중</h2>
            <form onSubmit={onSubmit}>
                <div className="container">
                    <div className="d-flex flex-wrap justify-content-between">
                        <p className="d-flex review_title">제목:
                            <input
                                onChange={onInputChange}
                                type="text"
                                name="r_title"
                                className="form-control"
                                value={review.r_title}
                                required
                                placeholder="제목"
                            />
                        </p>
                        <span>작성자 : {review.writer}</span>
                    </div>
                    <p className="review_content">내용
                        <textarea
                            onChange={onInputChange}
                            id="r_content"
                            className="form-control"
                            placeholder="내용"
                            name="r_content"
                            value={review.r_content}
                            rows="20"
                        />
                    </p>
                    <p>
                        <label>
                            <input
                                type="checkbox"
                                name="is_important"
                                checked={review.is_important}
                                onChange={onInputChange}
                            />
                            중요 공지사항
                        </label>
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
                    {reviewResource.map((rr) => (
                        <div key={rr.rrno}>
                            <p>{rr.rr_name} <button type="button" onClick={() => deleteSubmit(rr.rrno)}>X</button></p>
                        </div>
                    ))}
                </div>
                <div className="d-flex flex-wrap justify-content-between btns">
                    <button type="button" className="btn btn-outline-dark reviewListBtn" onClick={() => setShowModify(false)}>수정 취소</button>
                    <div>
                        <button type="submit" className="btn btn-outline-primary px-3 mx-2">수정</button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ReviewModify;
