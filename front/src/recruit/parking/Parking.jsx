import React, { useEffect, useState } from 'react';

const API_KEY = process.env.REACT_APP_PARKING_API_KEY;
const API_URL = 'http://api.odcloud.kr/api/15050093/v1/uddi:d19c8e21-4445-43fe-b2a6-865dff832e08';

const Parking = ({ location }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const totalPages = 50; // 병렬 처리할 페이지 수
                const pageSize = 300;

                const requests = Array.from({ length: totalPages }, (_, i) => {
                    const pageNo = i + 1;
                    const endpoint = `${API_URL}?page=${pageNo}&perPage=${pageSize}&serviceKey=${API_KEY}`;
                    return fetch(endpoint)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .catch(err => {
                            console.error(`페이지 ${pageNo}에서 데이터를 가져오는 중 오류 발생:`, err);
                        });
                });

                const responses = await Promise.all(requests);

                // responses가 undefined를 포함할 수 있으므로, 필터링
                const allData = responses
                    .filter(response => response && response.data)
                    .flatMap(response => response.data);

                console.log(`총 ${allData.length}개의 데이터를 가져왔습니다.`);

                // 중복 제거를 위한 Map 사용
                const uniqueDataMap = new Map();

                allData.forEach(item => {
                    const lat1 = parseFloat(location.y);
                    const lon1 = parseFloat(location.x);
                    const lat2 = parseFloat(item.위도);
                    const lon2 = parseFloat(item.경도);

                    const distance = calculateDistance(lat1, lon1, lat2, lon2);

                    if (distance <= 3) { // 원하는 km 이내 필터링
                        const uniqueKey = `${item.주차장명}-${lat2}-${lon2}`;
                        if (!uniqueDataMap.has(uniqueKey)) {
                            uniqueDataMap.set(uniqueKey, {
                                name: item.주차장명,
                                latitude: lat2,
                                longitude: lon2,
                                feeInfo: item.요금정보,
                                roadAddress: item.주차장도로명주소,
                                contact: item.연락처 || '연락처 없음',
                            });
                            console.log(`주차장명: ${item.주차장명}, 연락처: ${item.연락처}`);
                        }
                    }
                });

                const filteredData = Array.from(uniqueDataMap.values());

                setData(filteredData);

                console.log(`총 ${filteredData.length}개의 데이터를 필터링했습니다.`);
            } catch (error) {
                console.error('데이터를 가져오는 중 오류 발생:', error);
                setError(error);
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
        return <div>3km 이내 주변 주차장이 없습니다.</div>;
    }

    return (
        <div>
            <h2>인근 주차장 정보 (3km 이내)</h2>
            <ul>
                {data.map((parking, index) => (
                    <li key={index}>
                        <h3>{parking.name}</h3>
                        <p>요금 정보: {parking.feeInfo}</p>
                        <p>도로명 주소: {parking.roadAddress}</p>
                        <p>연락처: {parking.contact}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Parking;
