import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

const RecruitRead = () => {
    const { rno } = useParams();
    const [recruit, setRecruit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecruit = async () => {
            try {
                const response = await axios.get(`http://localhost/recruit/read/${rno}`);
                setRecruit(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchRecruit();
    }, [rno]);

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error : {error.message}</div>
    }

    if (!recruit) {
        return <div>No data found</div>
    }

    return (
        <div>
            <h2>Recruit Detail</h2>
            <div>
                <strong>Title: </strong>{recruit.r_title}
            </div>
            <div>
                <strong>Content: </strong>{recruit.r_content}
            </div>
            <div>
                <strong>Place: </strong>{recruit.r_place}
            </div>
            <div>
                <strong>Date: </strong>{recruit.r_date}
            </div>
            <div>
                <strong>Time: </strong>{recruit.r_time}
            </div>
            <div>
                <strong>Max Number: </strong>{recruit.max_number}
            </div>
            <div>
                <strong>Member ID: </strong>{recruit.memberRecruit ? recruit.memberRecruit.mid : 'N/A'}
            </div>
        </div>
    )

}

export default RecruitRead;