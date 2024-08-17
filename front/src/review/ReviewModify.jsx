import axios from "axios";
import { useEffect, useState } from "react";

const ReviewModify = ({ rno, setShowModify, setShowDetail }) => {
    const [loading, setLoading] = useState(true)
    const [review, setReview] = useState({
        r_title: "",
        r_content: "",
        writer: localStorage.getItem('mid') || "",
    })
    const [reviewResource, setReviewResource] = useState([]);
    const [nr_name, setNrName] = useState(null);

    const onInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "nr_name") {
            setNrName(files[0]);
        } else {
            setReview({
                ...review,
                [name]: value,
            });
        }
    };

    const getReview = async () => {
        const response = await (await axios.get(`http://localhost:8080/review/read?rno=${rno}`)).data;
        console.log(response)
        console.log(response.review_resource)
        setReview(response);
        setReviewResource(response.review_resource);
        setLoading(false);

    };

    const deleteSubmit = async (rrno) => {
        if (window.confirm('삭제하시겠습니까?')) {
            try {
                await axios.delete('http://localhost:8080/review/files/' + rrno);
                setReviewResource(reviewResource.filter(review => review.rrno !== rrno))
            } catch (error) {
                console.error("파일을 삭제하는 중 오류가 발생했습니다.")
            }
        }
    }

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
            console.log(formData)

            if (nr_name) {
                formData.append("files", nr_name);
            }

            const response = await axios.put(`http://localhost:8080/review/${rno}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then(result => {
                if (result.status === 200) {
                    alert("공지사항 등록이 성공적으로 완료되었습니다." + review.writer);
                    setShowModify(false);
                    setShowDetail(true);
                }
            }).catch(error => {
                console.log(error);
            });
        } catch (error) {

            console.error("등록 중 오류가 발생했습니다.", error);
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <h2 className="review">수정중</h2>
            <form onSubmit={(e) => e.preventDefault()}>
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
                    <p className="review_content" >내용
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
                    <div>
                    </div>
                     <p>첨부파일</p>
                    <input
                        onChange={onInputChange}
                        type="file"
                        id="rr_name"
                        className="form-control"
                        name="rr_name"
                    />
                    {reviewResource.map((rr) => (
                        <div key={rr.rrno}>
                            <p>{rr.rr_name} <button type="button" onClick={() => deleteSubmit(rr.rrno)}>X</button></p>
                        </div>
                    ))}
                </div>
                <div className="d-flex flex-wrap justify-content-between btns">
                    <button class="btn btn-outline-dark reviewListBtn" onClick={() => setShowModify(false)}>수정 취소</button>
                    <div>
                        <button type="button" className="btn btn-outline-primary px-3 mx-2" onClick={onSubmit}>수정</button>
                    </div>
                </div>
            </form>
        </>
    )

};
export default ReviewModify;