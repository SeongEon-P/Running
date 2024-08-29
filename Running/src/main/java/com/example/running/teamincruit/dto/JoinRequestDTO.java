package com.example.running.teamincruit.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JoinRequestDTO {
    private String teamName;
    private String userName;
}
