import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const IncruitList = () => {
    const [incruitList, setIncruitList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 서버로부터 모집 리스트를 가져오는 함수
        const fetchIncruitList = async () => {
            try {
                const response = await axios.get('/incruit/list');
                setIncruitList(response.data);
            } catch (err) {
                setError('모집 리스트를 불러오는 중 오류가 발생했습니다.');
                console.error(err);
            }
        };

        fetchIncruitList();
    }, []);

    return (
        <div>
            <h2>모집 리스트</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {incruitList.map((incruit) => (
                    <li key={incruit.ino}>
                        <Link to={`/incruit/${incruit.ino}`}>
                            {incruit.ititle} - {incruit.iwriter}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IncruitList;
