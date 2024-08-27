import axios from "axios";
import { useEffect, useState } from "react";

const InfoModify = ({ ino, setShowModify, setShowDetail }) => {
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState({
        i_title: "",
        i_content: "",
        writer: localStorage.getItem('mid') || "",
        is_important: false,
    });
    const [infoResource, setInfoResource] = useState([]);
    const [files, setFiles] = useState([]);

    const onInputChange = (e) => {
        const {  name, value, files: selectedFiles, type, checked } = e.target;
        if (name === "files") {
            setFiles(Array.from(selectedFiles));
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


    const getInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/info/read?ino=${ino}`);
            console.log("Fetched info data:", response.data);
            
            // 만약 writer가 제대로 들어오지 않으면 디버깅 메시지 출력
            if (!response.data.writer) {
                console.warn("Fetched info has no writer field!");
            }
    
            setInfo(response.data);
            setInfoResource(response.data.info_resource);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching info:", error);
        }
    };

    const deleteSubmit = async (irno) => {
        if (window.confirm('삭제하시겠습니까?')) {
            try {
                await axios.delete(`http://localhost:8080/info/files/${irno}`);
                setInfoResource(infoResource.filter(ir => ir.irno !== irno));
            } catch (error) {
                console.error("파일을 삭제하는 중 오류가 발생했습니다.", error);
            }
        }
    };

    useEffect(() => {
        getInfo();
    }, [ino]);

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("i_title", info.i_title);
            formData.append("i_content", info.i_content);
            formData.append("writer", info.writer);
            formData.append("is_important", info.is_important)

            files.forEach(file => {
                formData.append("files", file);
            });

            const response = await axios.put(`http://localhost:8080/info/${ino}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                alert("Info 수정이 성공적으로 완료되었습니다.");
                setShowModify(false);
                setShowDetail(true);
            }
        } catch (error) {
            console.error("수정 중 오류가 발생했습니다.", error);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <h2 className="info">수정중</h2>
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
                    <p>
                        <label>
                            <input
                                type="checkbox"
                                name="is_important"
                                checked={info.is_important}
                                onChange={onInputChange}
                            />
                            중요사항
                        </label>
                    </p>
                    <p>첨부파일</p>
                    <input
                        onChange={onInputChange}
                        type="file"
                        id="files"
                        className="form-control"
                        name="files"
                        multiple // Allow multiple file selection
                    />
                    {infoResource.map((ir) => (
                        <div key={ir.irno}>
                            <p>{ir.ir_name} <button type="button" onClick={() => deleteSubmit(ir.irno)}>X</button></p>
                        </div>
                    ))}
                </div>
                <div className="d-flex flex-wrap justify-content-between btns">
                    <button type="button" className="btn btn-outline-dark infoListBtn" onClick={() => setShowModify(false)}>수정 취소</button>
                    <div>
                        <button type="submit" className="btn btn-outline-primary px-3 mx-2">수정</button>
                    </div>
                </div>
            </form>
        </>
    );
};
export default InfoModify;