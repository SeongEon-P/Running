package com.example.running.teamincruit.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamManageDTO {
    private Long tno;
    private String teamName;
    private int teamMemberCount;
    private String teamMembers;
    private LocalDate teamStartdate;
    private String teamLeader;
    private String teamLogo;
    private String teamExplain;
    private Long teamFromPro;
    private Integer teamLevel;
    private List<TeamManageImgDTO> images;
}
