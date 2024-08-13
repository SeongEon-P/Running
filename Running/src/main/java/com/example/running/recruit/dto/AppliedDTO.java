package com.example.running.recruit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppliedDTO {
    private Long ano;

    private Long rno;

    private String mid;

}
