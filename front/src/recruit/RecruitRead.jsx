import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const RecruitRead = () => {
    const { rno, ano } = useParams();
    const { state } = useLocation();
    const [recruit, setRecruit] = useState([]);
    const [count, setCount] = useState(null);
    const [appliedList, setAppliedList] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const [location, setLocation] = useState({ x: null, y: null });
    const navigate = useNavigate();
    const { kakao } = window;

    useEffect(() => {
        // 모집 글 데이터 가져오기
        axios.get('http://localhost:8080/recruit/read', { params: { rno } })
            .then(response => {
                setRecruit(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the recruit!', error);
            });

        // 신청 인원 데이터 가져오기
        axios.get('http://localhost:8080/apply/count', { params: { rno } })
            .then(response => {
                setCount(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the recruit count!', error);
            });

        // 신청자 리스트 가져오기
        axios.get('http://localhost:8080/apply', { params: { rno } })
            .then(response => {
                setAppliedList(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the apply list!', error)
            });

        const userInfo = JSON.parse(localStorage.getItem('login'));
        if (userInfo && userInfo.mid) {
            setCurrentUser((prevState) => ({
                ...prevState,
                mid: userInfo.mid
            }))
        }
    }, [rno, ano])

    useEffect(() => {
        if (recruit.address) {
            axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
                params: { query: recruit.address },
                headers: {
                    Authorization: process.env.REACT_APP_API_KEY // 환경 변수에서 API 키를 가져옵니다.
                }
            })
                .then(response => {
                    const locationData = response.data.documents[0];
                    setLocation({
                        x: locationData.x,
                        y: locationData.y
                    });
                })
                .catch(error => {
                    console.error('There was an error fetching the location data!', error)
                })
        }
    }, [recruit.address])

    if (!recruit.rno) {
        return <div>Loading...</div>
    }

    // 목록으로 가기
    const handleBackClick = () => {
        // 이전 페이지로 돌아갈 때 현재 페이지 번호를 전달
        navigate('/recruit/list', { state: { currentPage: state?.currentPage } });
    };

    // 수정 페이지로 가기
    const handleModifyClick = (rno) => {
        navigate(`/recruit/modify/${rno}`);
    };

    const handleDeleteClick = () => {
        if (window.confirm('삭제하시겠습니까?')) {
            axios.delete(`http://localhost:8080/recruit/${rno}`)
                .then(response => {
                    alert('게시글이 삭제되었습니다.');
                    navigate('/recruit/list')
                })
                .catch(error => {
                    console.error('There was an error deleting the recruit!', error);
                    alert('삭제 중 오류가 발생했습니다.');
                });
        }
    };

    const handleApplyClick = () => {
        if (!currentUser.mid) {
            alert('로그인이 필요합니다.');
            return;
        }

        const appliedDTO = {
            rno: recruit.rno,
            mid: currentUser.mid
        };

        axios.post('http://localhost:8080/apply', appliedDTO)
            .then(response => {
                alert('신청이 완료되었습니다.');
                window.location.reload(); // 신청 후 페이지 새로고침
            })
            .catch(error => {
                console.error('There was an error applying!', error);
                alert('신청 중 오류가 발생했습니다.');
            });
    };

    const handleCancelApplication = (ano) => {
        if (window.confirm('신청을 취소하시겠습니까?')) {
            axios.delete(`http://localhost:8080/apply/${ano}`)
                .then(response => {
                    alert('신청이 취소되었습니다.');
                    window.location.reload();
                })
                .catch(error => {
                    console.error('There was an error cancelling the application', error);
                    alert('취소 중 오류가 발생했습니다.');
                });
        }
    }


    // 날짜 형식 변환 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // 'en-CA' 형식을 사용하면 'yyyy-mm-dd'로 표시됩니다.
    };

    // 배열로 이루어져 있는 날짜/시간 데이터의 표시 형식을 변환하는 법
    // const formatDate = (dateArray) => {
    //     const [year, month, day] = dateArray;
    //     return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // };

    // 시간 형식 변환 함수
    const formatTime = (timeArray) => {
        const [hour, minute] = timeArray;
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    };

    // 지도 나타내기
    const KakaoMap = ({ x, y }) => {
        useEffect(() => {
            if (x && y) {
                const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
                const options = {
                    center: new kakao.maps.LatLng(y, x), // 지도의 중심 좌표
                    level: 3
                };
                const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

                // 지도 위에 마커 표시
                const markerPosition = options.center;
                const marker = new kakao.maps.Marker({
                    position: markerPosition
                });
                marker.setMap(map);

                // 컨트롤바 표시 
                const mapTypeControl = new kakao.maps.MapTypeControl();

                // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
                // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
                map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

                // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
                const zoomControl = new kakao.maps.ZoomControl();
                map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

                // 인포윈도우 설정
                // 인포윈도우 내용
                const iwContent = `<div style="padding:5px;">${recruit.place} <br><a href="https://map.kakao.com/link/to/${recruit.place},${y},${x}" style="color:blue" target="_blank">길찾기</a></div>`;
                // 인포윈도우의 위치
                const iwPosition = options.center;
                // iwRemoveable을 true로 설정하면 인포윈도우를 닫을 수 있는 x 표시 생성
                const iwRemoveable = true;

                // 인포윈도우를 생성합니다
                const infowindow = new kakao.maps.InfoWindow({
                    position: iwPosition,
                    content: iwContent,
                    removable : iwRemoveable
                });

                // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
                infowindow.open(map, marker);

                // 마커에 클릭이벤트를 등록합니다
                kakao.maps.event.addListener(marker, 'click', function () {
                    // 마커 위에 인포윈도우를 표시합니다
                    infowindow.open(map, marker);
                });
            }


        }, [x, y]);

        return (
            <div id="map" style={{ width: '500px', height: '400px' }}></div>
        );
    };



    return (
        <>
            <div>
                <h1>제목 : {recruit.title}</h1>
                <p>내용 : {recruit.content}</p>
                <p>장소 : {recruit.address}</p>
                <p>장소 : {recruit.place}</p>
                <p>날짜 : {formatDate(recruit.date)}</p>
                <p>시간 : {formatTime(recruit.time)}</p>
                <p>모집인원 : {count !== null ? `${count}/${recruit.maxnumber}` : 'Loading...'}</p>
                <p>게시자 : {recruit.memberRecruit ? recruit.memberRecruit.mid : 'N/A'}</p>

                <button onClick={handleBackClick}>목록으로 가기</button>

                {currentUser && currentUser.mid === recruit.memberRecruit.mid ? (
                    <button onClick={() => handleModifyClick(rno)}>수정</button>
                ) : null}

                {currentUser && currentUser.mid === recruit.memberRecruit.mid ? (
                    <button onClick={handleDeleteClick}>삭제</button>
                ) : null}


                {currentUser.mid &&
                    currentUser.mid !== recruit.memberRecruit.mid &&
                    count !== recruit.max_number &&
                    !appliedList.some(applied => applied.memberApply.mid === currentUser.mid) && (
                        <button onClick={handleApplyClick}>신청하기</button>
                    )}
            </div>
            <div>
                <h1>신청한 사람</h1>

                <tbody>
                    {appliedList.length > 0 ? ( // appliedList가 유효한 배열인지 확인
                        appliedList.map(applied => (
                            <tr key={applied.ano}>
                                <td>{applied.memberApply.mid}</td>

                                {currentUser.mid === applied.memberApply.mid &&
                                    recruit.memberRecruit.mid !== applied.memberApply.mid && (
                                        <td>
                                            <button onClick={() => handleCancelApplication(applied.ano)}>신청 취소</button>
                                        </td>
                                    )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>신청자가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
                {location.x && location.y &&
                    <KakaoMap x={location.x} y={location.y} />}
            </div>
        </>
    )
}

export default RecruitRead;