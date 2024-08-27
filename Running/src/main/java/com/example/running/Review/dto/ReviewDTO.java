package com.example.running.Review.dto;

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
public class ReviewDTO {
    @NotNull
    private Long rno;
    private String r_title;
    private String r_content;
    private String writer;
    private String r_image;
    private LocalDateTime modDate;
    private LocalDateTime regDate;
    private List<ReviewResourceDTO> review_resource;
    private List<MultipartFile> files;
    private boolean important;
}
