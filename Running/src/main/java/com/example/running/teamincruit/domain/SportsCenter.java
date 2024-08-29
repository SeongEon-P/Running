package com.example.running.teamincruit.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SportsCenter {

    private String faciNm;  // 시설명
    private String faciGbNm;  // 시설구분명
    private String fcobNm;  // 업종명
    private String ftypeNm;  // 시설유형명
    private String cpNm;  // 시도명
    private String cpbNm;  // 시군구명
    private String faciAddr;  // 시설 주소
    private String faciRoadAddr;  // 도로명 주소
    private String faciStatNm;  // 상태
    private String updtDt;  // 갱신일
}
