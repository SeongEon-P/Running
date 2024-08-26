import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_PARKING_API_KEY;
const API_URL = 'http://api.odcloud.kr/api/15050093/v1/uddi:d19c8e21-4445-43fe-b2a6-865dff832e08';

const Parking = ({ location }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location && location.x && location.y) {
      const endpoint = `${API_URL}?serviceKey=${API_KEY}&pageNo=1&numOfRows=100&resultType=json`;

      fetch(endpoint)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((responseData) => {
          const filteredData = responseData.data.filter((item) => {
            const distance = calculateDistance(location.x, location.y, item.경도, item.위도);
            return distance < 10; // 10km 이내의 주차장만 필터링
          }).map((item) => ({
            name: item.주차장명,
            latitude: item.위도,
            longitude: item.경도,
            feeInfo: item.요금정보,
            roadAddress: item.주차장도로명주소,
            roadAddress2: item.주차장지번주소,
          }));
          setData(filteredData);
        })
        .catch((error) => {
          setError(error);
        });
    }
  }, [location]);

  const calculateDistance = (lon1, lat1, lon2, lat2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (data.length === 0) {
    return <div>주변 주차장이 없습니다.</div>;
  }

  return (
    <div>
      <h2>인근 주차장 정보</h2>
      <ul>
        {data.map((parking, index) => (
          <li key={index}>
            <h3>{parking.name}</h3>
            <p>위도: {parking.latitude}</p>
            <p>경도: {parking.longitude}</p>
            <p>요금 정보: {parking.feeInfo}</p>
            <p>도로명 주소: {parking.roadAddress}</p>
            <p>지번 주소: {parking.roadAddress2}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Parking;
