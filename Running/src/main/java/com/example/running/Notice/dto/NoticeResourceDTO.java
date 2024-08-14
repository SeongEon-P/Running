package com.example.running.Notice.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@ToString
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoticeResourceDTO {
    private Long nrno;
    private String nr_name;
    private String nr_path;
    private String nr_type;
    private Long nno;
    @Column
    private Long file_size;
    @NotNull
    private int nr_ord;
}
