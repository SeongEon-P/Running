package com.example.running.recruit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecruitDTO {
    // 게시글 번호
    private Long rno;

    // 게시글 제목
    private String rTitle;
    // 게시글 내용
    private String rContent;
    // 모이는 장소
    private String rPlace;
    // 모이는 날짜
    private LocalDate rDate;
    // 모이는 시간
    private Time rTime;
    // 모집 인원
    private Integer maxNumber;

    private String mid;
}
