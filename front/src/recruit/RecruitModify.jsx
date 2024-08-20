import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import DaumPostcode from 'react-daum-postcode';

const RecruitModify = () => {
    const { rno } = useParams();
    const [recruit, setRecruit] = useState({
        rno: '',
        r_title: '',
        r_content: '',
        address: '',
        r_place2: '',
        r_date: '',
        r_time: '',
        max_number: '',
        mid: ''
    });
    const [openPostcode, setOpenPostcode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/recruit/read', { params: { rno } })
            .then(response => {
                const data = response.data;
                setRecruit({
                    rno: data.rno,
                    r_title: data.r_title,
                    r_content: data.r_content,
                    address: data.address,
                    r_place2: data.r_place2,
                    r_date: `${data.r_date[0]}-${String(data.r_date[1]).padStart(2, '0')}-${String(data.r_date[2]).padStart(2, '0')}`, // 배열을 'yyyy-MM-dd' 형식의 문자열로 변환
                    r_time: data.r_time.slice(0, 2).map(num => String(num).padStart(2, '0')).join(':'), // 배열을 'hh:mm' 형식의 문자열로 변환
                    max_number: data.max_number,
                    mid: data.memberRecruit.mid
                });
            })
            .catch(error => {
                console.error('There was an error fetching the recruit!', error);
            });
    }, [rno]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecruit(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleModify = (rno) => {
        axios.put('http://localhost:8080/recruit', { ...recruit, rno })
            .then(response => {
                alert('게시글이 수정되었습니다.');
                navigate(`/recruit/read/${rno}`);
            })
            .catch(error => {
                console.error('There was an error updating the recruit!', error);
                alert('수정 중 오류가 발생했습니다.');
            });
    };

    const handleRowClick = (rno) => {
        navigate(`/recruit/read/${rno}`);
    };

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress +=
                    extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        setRecruit({ ...recruit, address: fullAddress });
        setOpenPostcode(false); // 주소 선택 후 모달 닫기
    };

    return (
        <div>
            <h1>게시글 수정</h1>
            <form>
                <input type="hidden" name="mid" value={recruit.mid} onChange={handleChange} />
                <div>
                    <label>게시글 번호:</label>
                    <input type="text" name="rno" value={recruit.rno} onChange={handleChange} readOnly />
                </div>
                <div>
                    <label>제목:</label>
                    <input type="text" name="r_title" value={recruit.r_title} onChange={handleChange} />
                </div>
                <div>
                    <label>내용:</label>
                    <textarea name="r_content" value={recruit.r_content} onChange={handleChange}></textarea>
                </div>
                <div>
                    <div>
                        {/* 다음 주소 api 넣을거임 */}
                        <label>모이는 장소: </label>
                        <input
                            type="text"
                            name="address"
                            value={recruit.address}
                            onChange={handleChange}
                            readOnly
                        />
                        <button type="button" onClick={() => setOpenPostcode(true)}>주소 검색</button>
                    </div>
                </div>
                <div>
                    <label>장소2:</label>
                    <input type="text" name="r_place2" value={recruit.r_place2} onChange={handleChange} />
                </div>
                <div>
                    <label>날짜:</label>
                    <input type="date" name="r_date" value={recruit.r_date} onChange={handleChange} />
                </div>
                <div>
                    <label>시간:</label>
                    <input type="time" name="r_time" value={recruit.r_time} onChange={handleChange} />
                </div>
                <div>
                    <label>모집인원:</label>
                    <input type="number" name="max_number" value={recruit.max_number} onChange={handleChange} />
                </div>
                <button type="button" onClick={() => handleModify(rno)}>수정 완료</button>
                <button type="button" onClick={() => handleRowClick(rno)}>수정 취소</button>
            </form>

            {openPostcode && (
                <div className="modal">
                    <div className="modla-content">
                        <span
                            className="modal-cloas"
                            onClick={() => setOpenPostcode(false)}
                        >
                            &times;
                        </span>
                        <DaumPostcode onComplete={handleComplete} />
                    </div>
                </div>
            )}

        </div>
    );
};

export default RecruitModify;