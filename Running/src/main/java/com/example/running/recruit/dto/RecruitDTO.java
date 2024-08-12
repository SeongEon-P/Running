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
    private String r_title;
    // 게시글 내용
    private String r_content;
    // 모이는 장소
    private String r_place;
    // 모이는 날짜
    private LocalDate r_date;
    // 모이는 시간
    private Time r_time;
    // 모집 인원
    private Integer max_number;

    private Long id;
}
