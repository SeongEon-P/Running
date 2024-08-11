package com.example.running.teamincruit.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamManageDTO {
    private String teamName;
    private int teamMemberCount;
    private String teamMembers;
    private LocalDate teamStartdate;
    private String teamLeader;
    private String teamLogo;
    private String teamExplain;
    private Long teamFromPro;
    private Integer teamLevel;
}
