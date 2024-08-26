import React, { useEffect, useState } from 'react';

const API_KEY = process.env.REACT_APP_PARKING_API_KEY;
const API_URL = 'http://api.odcloud.kr/api/15050093/v1/uddi:d19c8e21-4445-43fe-b2a6-865dff832e08';

const Parking = ({ location }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            let pageNo = 1;
            const pageSize = 100;
            const filteredData = [];

            while (true) {
                try {
                    // const endpoint = `${API_URL}?serviceKey=${API_KEY}&pageNo=${pageNo}&numOfRows=${pageSize}&resultType=json`;
                    const endpoint = `${API_URL}?serviceKey=${API_KEY}&pageNo=1&numOfRows=12806&resultType=json`; // 모든 데이터를 한 번에 요청
                    const response = await fetch(endpoint);
                    const responseData = await response.json();

                    if (responseData.data && Array.isArray(responseData.data)) {
                        responseData.data.forEach((item) => {
                            const lat1 = parseFloat(location.y);
                            const lon1 = parseFloat(location.x);
                            const lat2 = parseFloat(item.위도);
                            const lon2 = parseFloat(item.경도);

                            const distance = calculateDistance(lat1, lon1, lat2, lon2);
                            console.log(`주차장: ${item.주차장명}, 좌표: (${lat2}, ${lon2}), 거리: ${distance.toFixed(2)} km`);

                            if (distance <= 3) { // 3km 이내 필터링
                                filteredData.push({
                                    name: item.주차장명,
                                    latitude: lat2,
                                    longitude: lon2,
                                    feeInfo: item.요금정보,
                                    roadAddress: item.주차장도로명주소,
                                    roadAddress2: item.주차장지번주소,
                                });
                            }
                        });

                        if (responseData.data.length < pageSize) {
                            // 모든 데이터를 다 불러왔으므로 종료
                            break;
                        }
                    } else {
                        setError(new Error("API 응답 데이터 형식이 올바르지 않습니다."));
                        break;
                    }
                } catch (error) {
                    setError(error);
                    break;
                }

                pageNo += 1; // 다음 페이지로 이동
            }

            if (filteredData.length > 0) {
                setData(filteredData);
            } else {
                console.log("전체 데이터에서 필터링된 결과가 없습니다.");
            }
        };

        if (location && location.x && location.y) {
            console.log("필터링할 좌표:", location.x, location.y);
            fetchData();
        }
    }, [location]);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // 지구 반경 (km)
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
            <h2>인근 주차장 정보 (3km 이내)</h2>
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
