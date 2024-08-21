import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoList from "./InfoList";
import InfoModify from "./InfoModify";

const InfoDetail = ({ ino }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState({});
    const [infoResources, setInfoResources] = useState([]);
    const [showModify, setShowModify] = useState(false);
    const [showList, setShowList] = useState(false);
    const [currentUser, setCurrentUser] = useState(""); // Current user state

    const getInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/info/read?ino=${ino}`);
            setInfo(response.data);
            setInfoResources(response.data.info_resource);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching info details", error);
        }
    };

    useEffect(() => {
        // Fetch current user info from localStorage
        const user = JSON.parse(localStorage.getItem('login'));
        if (user) {
            setCurrentUser(user.name); // Set current user
        }
    }, []);

    const handleModify = () => {
        setShowModify(true);
    };

    const handleDelete = async () => {
        if (window.confirm(`${info.ino}번의 Info 삭제 하시겠습니까?`)) {
            try {
                await axios.delete(`http://localhost:8080/info/${ino}`);
                console.log(`${info.ino} Info 삭제 완료`);
                alert(`${info.ino}가 삭제되었습니다.`);
                setShowList(true);
            } catch (error) {
                console.error('삭제중 오류발생', error);
                alert('삭제중 오류가 발생했습니다.');
            }
        }
    };

    useEffect(() => {
        getInfo();
    }, [ino, showModify]);

    const canModifyOrDelete = info.writer === currentUser;

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : showList ? (
                <InfoList/>
            ) : showModify ? (
                <InfoModify ino={ino} setShowModify={setShowModify} setShowDetail={() => setShowList(false)} />
            ) : (
                <>
                    <h2 className="info">Info</h2>
                    <div className="container">
                        <div className="form-control">
                            <div className="d-flex flex-wrap justify-content-between">
                                <p className="info_title">{info.i_title}</p>
                                <span>작성자 : {info.writer}</span>
                            </div>
                        </div>
                        <div className="form-control">
                            <p className="IncruitView_p">
                                등록일: {new Date(info.regDate[0], info.regDate[1] - 1, info.regDate[2], info.regDate[3], info.regDate[4], info.regDate[5]).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="form-control">
                            <p className="info_content">내용: {info.i_content}</p> {/* Add this line to display the content */}
                            {infoResources.length > 0 ? (
                                infoResources.map((resource, index) => (
                                    <div key={index} style={{ marginBottom: '15px' }}>
                                        {resource.ir_type.startsWith("image") ? (
                                            <img
                                                src={`http://localhost:8080/info/files/${resource.ir_name}`}
                                                alt={resource.ir_name}
                                                style={{ width: '100%', maxWidth: '600px', height: 'auto' }}
                                            />
                                        ) : (
                                            <p>
                                                <a href={`http://localhost:8080/info/files/${resource.ir_name}`}>
                                                    {resource.ir_name}
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>첨부 파일이 없습니다.</p>
                            )}
                        </div>
                    </div>

                    <div className="d-flex flex-wrap justify-content-between btns">
                        <button
                            className="btn btn-outline-dark infoListBtn"
                            onClick={() => setShowList(true)}
                        >
                            목록으로 가기
                        </button>
                        <div className="">
                            {canModifyOrDelete && (
                                <>
                                    <button className="btn btn-outline-primary infoModifyBtn" onClick={handleModify}>
                                        수정
                                    </button>
                                    <button className="btn btn-outline-danger infoRemoveBtn" onClick={handleDelete}>
                                        삭제
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
export default InfoDetail;