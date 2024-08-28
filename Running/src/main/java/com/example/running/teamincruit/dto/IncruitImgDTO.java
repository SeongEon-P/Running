package com.example.running.teamincruit.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncruitImgDTO {

    private String incruitUuid;
    private String incruitFileName;
    private int incruitOrd;
    private Long ino;
}
