import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPage.css'; // CSS 파일 import

const AdminPage = () => {
    const [teamRequests, setTeamRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamRequests = async () => {
            try {
                const response = await axios.get('/admin/team-requests');
                setTeamRequests(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setError('팀 생성 요청을 불러오는 중 오류가 발생했습니다.');
                console.error(err);
            }
        };

        fetchTeamRequests();

        // adminPage_body 클래스를 body 태그에 추가
        document.body.classList.add('adminPage_body');

        // 컴포넌트 언마운트 시 adminPage_body 클래스를 제거
        return () => {
            document.body.classList.remove('adminPage_body');
        };
    }, []);

    const handleApprove = async (teamId) => {
        try {
            await axios.post(`/admin/approve-team/${teamId}`);
            setTeamRequests(teamRequests.filter(request => request.trno !== teamId));
        } catch (err) {
            console.error('팀 승인 중 오류가 발생했습니다.', err);
        }
    };

    const handleReject = async (teamId) => {
        try {
            await axios.post(`/admin/reject-team/${teamId}`);
            setTeamRequests(teamRequests.filter(request => request.trno !== teamId));
        } catch (err) {
            console.error('팀 거절 중 오류가 발생했습니다.', err);
        }
    };

    return (
        <div className="adminPage_container">
            <h3>관리자 페이지 - 팀 생성 요청</h3>
            {error && <p className="adminPage_error">{error}</p>}
            <ul className="adminPage_teamRequests">
                {Array.isArray(teamRequests) && teamRequests.map(request => (
                    <li key={request.trno}>
                        <span className="adminPage_teamInfo">{request.teamName} - {request.teamLeader}</span>
                        <div>
                            <button onClick={() => handleApprove(request.trno)}>승인</button>
                            <button onClick={() => handleReject(request.trno)}>거절</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPage;
