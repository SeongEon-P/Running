package com.example.running.recruit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecruitDTO {
    // 게시글 번호
    private Long rno;

    // 게시글 제목
    private String title;
    // 게시글 내용
    private String content;
    // 모이는 장소
    private String address;
    private String place;
    // 모이는 날짜
    private LocalDate date;
    // 모이는 시간
    private LocalTime time;
    // 모집 인원
    private Integer maxnumber;

    private String mid;
}
