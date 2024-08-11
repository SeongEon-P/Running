package com.example.running.teamincruit.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamManageImgDTO {

    private String teamManageUuid;
    private String teamManageFileName;
    private int teamManageOrd;
    private String teamName;
}
