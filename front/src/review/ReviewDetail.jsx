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
    const [currentUser, setCurrentUser] = useState("");
    

    const getReview = async () => {
        const response = await (await axios.get(`http://localhost:8080/review/read?rno=${rno}`)).data;
        setReview(response);
        setReviewResource(response.review_resource);
        setLoading(false);
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

    const canModifyOrDelete = review.writer === currentUser;

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
                            <span> 등록일 : {new Date(review.regDate[0], review.regDate[1] - 1, review.regDate[2], review.regDate[3], review.regDate[4], review.regDate[5]).toLocaleDateString()}</span>
                            
                        </div>
                        <div className="form-control">
                            <p className="review_content">내용: {review.r_content}</p> {/* Add this line to display the content */}
                            {reviewResource.length > 0 ? (
                                reviewResource.map((resource, index) => (
                                    <div key={index} style={{ marginBottom: '15px' }}>
                                        {resource.rr_type.startsWith("image") ? (
                                            <img
                                                src={`http://localhost:8080/review/files/${resource.rr_name}`}
                                                alt={resource.rr_name}
                                                style={{ width: '100%', maxWidth: '600px', height: 'auto' }}
                                            />
                                        ) : (
                                            <p>
                                                <a href={`http://localhost:8080/review/files/${resource.rr_name}`}>
                                                    {resource.rr_name}
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>첨부 파일이 없습니다.</p>
                            )}
                        </div>
                    </div>

                    <div className="d-flex flex-wrap justify-content-between btns">
                        <button
                            className="btn btn-outline-dark noticeListBtn"
                            onClick={() => setShowList(true)}
                        >
                            목록으로 가기
                        </button>
                        <div className="">
                            {canModifyOrDelete && (
                                <>
                                    <button className="btn btn-outline-primary reviewModifyBtn" onClick={handleModify}>
                                        수정
                                    </button>
                                    <button className="btn btn-outline-danger reviewRemoveBtn" onClick={handleDelete}>
                                        삭제
                                    </button>
                                </>
                            )}
                          </div>
                    </div>
                </>
            )}
        </>
    );

};

export default ReviewDetail;