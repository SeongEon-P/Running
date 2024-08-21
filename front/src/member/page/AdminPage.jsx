import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
    const [teamRequests, setTeamRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamRequests = async () => {
            try {
                const response = await axios.get('/admin/team-requests');
                // Ensure that the data is an array
                setTeamRequests(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setError('팀 생성 요청을 불러오는 중 오류가 발생했습니다.');
                console.error(err);
            }
        };

        fetchTeamRequests();
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
        <div>
            <h2>관리자 페이지 - 팀 생성 요청</h2>
            {error && <p>{error}</p>}
            <ul>
                {Array.isArray(teamRequests) && teamRequests.map(request => (
                    <li key={request.trno}>
                        {request.teamName} - {request.teamLeader}
                        <button onClick={() => handleApprove(request.trno)}>승인</button>
                        <button onClick={() => handleReject(request.trno)}>거절</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPage;
