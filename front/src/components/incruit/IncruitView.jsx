import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const IncruitView = () => {
    const { ino } = useParams(); // URL에서 ino를 가져옴
    const [incruit, setIncruit] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 서버로부터 모집 상세 정보를 가져오는 함수
        const fetchIncruit = async () => {
            try {
                const response = await axios.get(`/incruit/${ino}`);
                setIncruit(response.data);
            } catch (err) {
                setError('모집 정보를 불러오는 중 오류가 발생했습니다.');
                console.error(err);
            }
        };

        fetchIncruit();
    }, [ino]);

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {incruit ? (
                <div>
                    <h2>{incruit.ititle}</h2>
                    <p>작성자: {incruit.iwriter}</p>
                    <p>내용: {incruit.icontent}</p>
                    <p>팀 이름: {incruit.teamName}</p>
                    <p>팀 설명: {incruit.teamExplain}</p>
                    <p>팀 리더: {incruit.teamLeader}</p>
                    <p>팀원 수: {incruit.teamMemberCount}</p>
                    <p>팀 시작일: {new Date(incruit.teamStartdate).toLocaleDateString()}</p>
                    <p>등록일: {new Date(incruit.regDate).toLocaleDateString()}</p>
                    <p>조회수: {incruit.iviews}</p>
                    
                    {/* 이미지 리스트를 렌더링 */}
                    {incruit.images && incruit.images.length > 0 ? (
                        incruit.images.map((img, index) => (
                            <img
                                key={index}
                                src={`/view/${encodeURIComponent(img.teamManageFileName)}`}
                                alt={`Team Image ${index + 1}`}
                                style={{ width: '400px', height: 'auto', margin: '10px' }}
                            />
                        ))
                    ) : (
                        <p>팀 이미지가 없습니다.</p>
                    )}

                    <button onClick={() => navigate(`/incruit/edit/${ino}`)}>수정</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default IncruitView;
