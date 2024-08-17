import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import Reviewlist from "./ReviewList";
import Reviewmodify from "./ReviewModify";

const ReviewDetail = ({ rno }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [review, setReview] = useState({});
    const [reviewResource, setReviewResource] = useState([]);
    const [showModify, setShowModify] = useState(false);
    const [showList, setShowList] = useState(false);

    const getReview = async () => {
        const response = await (await axios.get(`http://localhost:8080/review/read?rno=${rno}`)).data;
        setReview(response);
        setReviewResource(response.review_resource);
        setLoading(false);
    };
    const handleModify = () => {
        setShowModify(true);
    }
    const handleDelete = async () => {
        if (window.confirm(`${review.rno}번의 공지사항을 삭제 하시겠습니까?`))
            try {
                await axios.delete(`http://localhost:8080/review/${rno}`)
                console.log(`${review.rno} 공지사항 삭제 완료`);
                alert(`${review.rno}가 삭제되었습니다.`);
                setShowList(true);
            } catch (error) {
                console.log('삭제중 오류발생', error);
                alert('삭제중 오류가 발생했습니다.')
            };
    };
    useEffect(() => {
        getReview();
    }, [rno, showModify]);

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
                <Reviewlist />
            ) : showModify ? (
                <Reviewmodify rno={rno} setShowModify={setShowModify} setShowDetail={() => setShowList(false)} />
            ) : (
                <>
                    <h2 className="review">리뷰</h2>
                    <div className="container">
                        <div className="form-control">
                            <div className="d-flex flex-wrap justify-content-between">
                                <span className="review_title">{review.r_title}</span>
                                <span>작성자 : {review.writer}</span>
                            </div>
                        </div>
                        <div className="form-control">
                            <span> 등록일 : {formatDate(review.regDate)} </span>
                        </div>
                        <div className="form-control">
                            <pre className="review_content">{review.r_content}</pre>
                        </div>
                        <div className="form-control">
                            {reviewResource.map((rr, index) => (
                                <p key={index}>
                                    <a href={'http://localhost:8080/file/' + rr.rr_name}>{rr.rr_name}</a>
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="d-flex flex-wrap justify-content-between btns">
                        <button
                          className="btn btn-outline-dark reviewListBtn"
                          onClick={() =>setShowList(true)}>
                            목록으로 가기
                          </button>
                          <div className="">
                            <button className="btn btn-outline-primary reviewModifyBtn" onClick={handleModify}>수정</button>
                            <button className="btn btn-outline-danger reviewRemoveBtn" onClick={handleDelete}>삭제</button>
                          </div>
                    </div>
                </>
            )}
        </>
    );

};

export default ReviewDetail;