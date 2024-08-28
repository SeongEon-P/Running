package com.example.running.teamincruit.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamRequestImgDTO {

    private String teamRequestUuid;  // 팀 요청 이미지의 고유 ID
    private String teamRequestFileName;  // 이미지 파일 이름
    private int teamRequestOrd;  // 이미지의 순서
}
