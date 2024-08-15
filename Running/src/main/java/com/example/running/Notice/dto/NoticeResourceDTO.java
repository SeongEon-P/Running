package com.example.running.Notice.dto;

import com.example.running.Notice.domain.NoticeResource;
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
    private Long file_size;
    private int nr_ord;

    public NoticeResourceDTO(NoticeResource nr){
        this.nrno = nr.getNrno();
        this.nr_name = nr.getNr_name();
        this.nr_path = nr.getNr_path();
        this.nr_type = nr.getNr_type();
        this.nno = nr.getNotice().getNno();
        this.file_size = nr.getFile_size();
        this.nr_ord = nr.getNr_ord();
    }
}
