import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecruitList = () => {
  const [recruits, setRecruits] = useState([]);
  const [counts, setCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/recruit/list')
      .then(response => {
        setRecruits(response.data);

        // 각 모집 게시글에 대해 신청 인원을 가져오는 추가 API 호출
        response.data.forEach(recruit => {
          axios.get('http://localhost:8080/apply/count', { params: { rno: recruit.rno } })
            .then(countResponse => {
              setCounts(prevCounts => ({
                ...prevCounts,
                [recruit.rno]: countResponse.data
              }));
            })
            .catch(error => {
              console.error('There was an error fetching the recruit count!', error);
            });
        });
      })
      .catch(error => {
        console.error('There was an error fetching the recruit list!', error);
      });
  }, []);

  const handleRowClick = (rno) => {
    navigate(`/recruit/read/${rno}`);
  };

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // 'en-CA' 형식을 사용하면 'yyyy-mm-dd'로 표시됩니다.
  };

  // 배열로 이루어져 있는 날짜/시간 데이터의 표시 형식을 변환하는 법
  // const formatDate = (dateArray) => {
  //     const [year, month, day] = dateArray;
  //     return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  // };

  // 시간 형식 변환 함수
  const formatTime = (timeArray) => {
    const [hour, minute] = timeArray;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };


  return (
    <div>
      <h1>Recruit List</h1>
      <table>
        <thead>
          <tr>
            <th>rno</th>
            <th>Title</th>
            <th>Content</th>
            <th>Place</th>
            <th>Date</th>
            <th>Time</th>
            <th>Max Number</th>
          </tr>
        </thead>
        <tbody>
          {recruits.map(recruit => (
            <tr key={recruit.rno} onClick={() => handleRowClick(recruit.rno)}>
              <td>{recruit.rno}</td>
              <td>{recruit.r_title}</td>
              <td>{recruit.r_content}</td>
              <td>{recruit.r_place}</td>
              <td>{formatDate(recruit.r_date)}</td>
              <td>{formatTime(recruit.r_time)}</td>
              <td>{counts[recruit.rno] !== undefined ? counts[recruit.rno] : 'Loading...'}/{recruit.max_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecruitList;