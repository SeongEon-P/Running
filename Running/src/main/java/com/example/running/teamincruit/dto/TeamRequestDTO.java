package com.example.running.teamincruit.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamRequestDTO {

    private Long trno;  // TeamRequest ID
    private String teamName;
    private int teamMemberCount;
    private String teamMembers;
    private LocalDate teamStartdate;
    private String teamLeader;
    private String teamLogo;
    private String teamExplain;
    private Long teamFromPro;
    private Integer teamLevel;
    private String status;  // "PENDING", "APPROVED", "REJECTED" 등을 표현
    private List<TeamRequestImgDTO> images;  // 팀 이미지 리스트

    // 추가된 생성자
    public TeamRequestDTO(Long trno, String teamName, int teamMemberCount, String teamMembers, LocalDate teamStartdate,
                          String teamLeader, String teamLogo, String teamExplain, Long teamFromPro, Integer teamLevel, String status) {
        this.trno = trno;
        this.teamName = teamName;
        this.teamMemberCount = teamMemberCount;
        this.teamMembers = teamMembers;
        this.teamStartdate = teamStartdate;
        this.teamLeader = teamLeader;
        this.teamLogo = teamLogo;
        this.teamExplain = teamExplain;
        this.teamFromPro = teamFromPro;
        this.teamLevel = teamLevel;
        this.status = status;
    }
}
