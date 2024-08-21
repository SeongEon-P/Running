package com.example.running.info.dto;

import com.example.running.Notice.domain.NoticeResource;
import com.example.running.info.domain.InfoResource;
import lombok.*;

@ToString
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InfoResourceDTO {
    private Long irno;
    private String ir_name;
    private String ir_path;
    private String ir_type;
    private Long ino;
    private Long file_size;
    private int ir_ord;

    public InfoResourceDTO(InfoResource ir){
        this.irno = ir.getIrno();
        this.ir_name = ir.getIr_name();
        this.ir_path = ir.getIr_path();
        this.ir_type = ir.getIr_type();
        this.ino = ir.getInfo().getIno();
        this.file_size = ir.getFile_size();
        this.ir_ord = ir.getIr_ord();
    }
}
