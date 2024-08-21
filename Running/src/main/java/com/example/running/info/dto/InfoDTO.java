package com.example.running.info.dto;

import com.example.running.Notice.dto.NoticeResourceDTO;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@ToString
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InfoDTO {
    @NotNull
    private Long ino;
    private String i_title;
    private String i_content;
    private String writer;
    private LocalDateTime modDate;
    private LocalDateTime regDate;
    private String i_image;
    private List<InfoResourceDTO> info_resource;
    private List<MultipartFile> files;
}
