import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoList from "./InfoList";
import InfoDetail from "./InfoDetail";

const InfoRegister = () => {
    const navigate = useNavigate();
    const [info, setInfo] = useState({
        i_title: "",
        i_content: "",
        writer: "",
        is_important: false,
    });
    const [ir_files, setIrFiles] = useState([]);
    const [showInfoList, setShowInfoList] = useState(false);
    const [showInfoDetail, setShowInfoDetail] = useState(false);
    const [registeredIno, setRegisteredIno] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const onInputChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        if (name === "ir_files") {
            setIrFiles([...files]); // 여러 파일을 배열로 저장
        } else if (type === "checkbox") {
            setInfo({
                ...info,
                [name]: checked,
            });
        } else {
            setInfo({
                ...info,
                [name]: value,
            });
        }
    };
    
    useEffect(() => {
        const loginData = JSON.parse(localStorage.getItem('login'));
        if (loginData && loginData.name) {
            setInfo(prevData => ({
                ...prevData,
                writer: loginData.name
            }));
        }
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("i_title", info.i_title);
            formData.append("i_content", info.i_content);
            formData.append("writer", info.writer);
            formData.append("is_important", info.is_important);

            if (ir_files.length > 0) {
                ir_files.forEach((file) => {
                    formData.append("files", file);
                });
            }

            const response = await axios.post("http://localhost:8080/info/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                alert("Info 등록이 성공적으로 완료되었습니다.");
                setRegisteredIno(response.data.ino);
                setShowInfoDetail(true);
            }
        } catch (error) {
            console.error("등록 중 오류가 발생했습니다.", error);
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    const handleListClick = () => {
        setShowInfoList(true);
    };

    return (
        <>
            {showInfoList ? (
                <InfoList />
            ) : showInfoDetail ? (
                <InfoDetail ino={registeredIno} />
            ) : (
                <>
                    <h2 className="info">Info</h2>
                    <form onSubmit={onSubmit}>
                        <div className="container">
                            <div className="d-flex flex-wrap justify-content-between">
                                <p className="d-flex info_title">제목:
                                    <input
                                        onChange={onInputChange}
                                        type="text"
                                        name="i_title"
                                        className="form-control"
                                        value={info.i_title}
                                        required
                                        placeholder="제목"
                                    />
                                </p>
                                <span>작성자 : {info.writer}</span>
                            </div>
                            <p className="info_content">내용
                                <textarea
                                    onChange={onInputChange}
                                    id="i_content"
                                    className="form-control"
                                    placeholder="내용"
                                    name="i_content"
                                    value={info.i_content}
                                    rows="20"
                                />
                            </p>
                            <a>첨부파일</a>
                            <input
                                onChange={onInputChange}
                                type="file"
                                id="ir_files"
                                className="form-control"
                                name="ir_files"
                                multiple // 다중 파일 업로드를 허용
                            />
                        </div>
                        
                        <div className="d-flex flex-wrap justify-content-between btns">
                            <button className="btn btn-outline-dark infoListBtn" onClick={handleListClick}>목록으로 돌아가기</button>
                            <div className="">
                                <button type="submit" className="btn btn-outline-primary px-3 mx-2">
                                    등록
                                </button>
                            </div>
                        </div>
                    </form>
                </>
            )}
        </>
    );
};
export default InfoRegister;