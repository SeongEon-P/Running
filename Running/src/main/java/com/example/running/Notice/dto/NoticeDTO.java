package com.example.running.Notice.dto;

import com.example.running.Notice.domain.NoticeResource;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@ToString
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoticeDTO {
    @NotNull
    private Long nno;
    private String n_title;
    private String n_content;
    private String writer;
    private LocalDateTime modDate;
    private LocalDateTime regDate;
    private String n_image;
    private List<NoticeResourceDTO> notice_resource;
    private List<MultipartFile> files;
}
