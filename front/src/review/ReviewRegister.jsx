import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReviewDetail from "./ReviewDetail";
import Reviewlist from "./ReviewList";

const ReviewRegister = () => {
    const navigate = useNavigate();
    const [review, setReview] = useState({
        r_title: "",
        r_content: "",
        writer:"",
        is_important: false,
    });
    const [showReviewList, setShowReviewList] = useState(false);
    const [showReviewDetail, setShowReviewDetail] = useState(false);
    const [registeredRno, setRegisteredRno] = useState(null); 
    const [rr_files, setRrFiles] = useState([]);


    const onInputChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        if (name === "rr_files") {
            setRrFiles([...files]); // 여러 파일을 배열로 저장
        } else if (type === "checkbox") {
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

    const onSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formData = new FormData();
            formData.append("r_title", review.r_title);
            formData.append("r_content", review.r_content);
            formData.append("writer", review.writer);
            formData.append("is_important", review.is_important); // 이 부분은 정상적으로 처리되어야 합니다.
    
            // 파일을 FormData에 추가
            if (rr_files.length > 0) {
                rr_files.forEach((file) => {
                    formData.append("files", file);
                });
            }
    
            // FormData의 내용을 콘솔에 출력하여 디버깅
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
    
            const response = await axios.post("http://localhost:8080/review/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status === 201) {
                alert("리뷰 등록이 성공적으로 완료되었습니다.");
                setRegisteredRno(response.data.rno);
                setShowReviewDetail(true);
            }
        } catch (error) {
            console.error("등록 중 오류가 발생했습니다.", error);
            alert("등록 중 오류가 발생했습니다.");
        }
    };
    

    const handleListClick = () => {
        setShowReviewList(true);
    }

    return (
        <>
            {showReviewList ? (
                <Reviewlist />
            ) : showReviewDetail ? (
                <ReviewDetail rno={registeredRno} />
            ) : (
                <>
                    <h2 class="review">리뷰</h2>
                    <form onSubmit={onSubmit}>
                        <div class="container">
                            <div class="d-flex flex-wrap justify-content-between">
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
                            <p class="review_content">내용
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
                            <a>첨부파일</a>
                            <input
                                onChange={onInputChange}
                                type="file"
                                id="rr_files"
                                className="form-control"
                                name="rr_files"
                                multiple
                            />
                        </div>
                        <div class="d-flex flex-wrap justify-content-between btns">
                            <button class="btn btn-outline-dark reviewListBtn" onClick={handleListClick}>목록으로 돌아가기</button>
                            <div class="">
                                <button type="submit" className="btn btn-outline-primary px-3 mx-2">
                                    등록
                                </button>
                            </div>
                        </div>
                    </form>
                </>
            )}
        </>
    );
};

export default ReviewRegister;
