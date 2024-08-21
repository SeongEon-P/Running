import React, { useEffect } from "react";

// 참고
// React에서 Kakao map API 사용하기
// https://velog.io/@tpgus758/React%EC%97%90%EC%84%9C-Kakao-map-API-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
// [React] 리액트에서 .env 환경변수 사용하기!
// https://shape-coding.tistory.com/entry/React-%EB%A6%AC%EC%95%A1%ED%8A%B8%EC%97%90%EC%84%9C-env-%ED%99%98%EA%B2%BD%EB%B3%80%EC%88%98-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
// React Kakao Map SDK 사용하기
// https://velog.io/@wlwl99/React-Kakao-Map-SDK-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0

const { kakao } = window;

const KakaoMap = () => {
  useEffect(() => {
    const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570557), // 지도의 중심 좌표
      level: 3
    };
    const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
  }, []);

  return (
    <div id="map" style={{ width: '500px', height: '400px' }}></div>
  );
};

export default KakaoMap;