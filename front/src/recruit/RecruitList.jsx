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
    navigate(`/recruit/read/${rno}`); // useNavigate를 사용하여 페이지 이동
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
              <td>{recruit.r_date}</td>
              <td>{recruit.r_time}</td>
              <td>{counts[recruit.rno] !== undefined ? counts[recruit.rno] : 'Loading...'}/{recruit.max_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecruitList;