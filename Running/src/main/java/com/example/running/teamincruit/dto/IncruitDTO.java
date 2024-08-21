package com.example.running.teamincruit.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncruitDTO {

    private Long ino;
    private String icontent;
    private String ititle;
    private String iwriter;
    private int iviews;
    private String teamName;
    private int teamMemberCount;
    private String teamMembers;
    private LocalDate teamStartdate;
    private String teamExplain;
    private String teamLeader;
    private String teamLogo;
    private Integer teamLevel;
    private Long teamFromPro;
    private LocalDateTime regDate;

    // 팀 이미지 리스트
    private List<TeamManageImgDTO> images;

}
