package com.example.running.teamincruit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberRequestDTO {

    private Long id;
    private String userName;
    private String teamName;
}

