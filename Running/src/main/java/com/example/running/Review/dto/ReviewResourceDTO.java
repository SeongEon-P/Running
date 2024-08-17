package com.example.running.Review.dto;

import com.example.running.Review.domain.Review;
import com.example.running.Review.domain.ReviewResource;
import lombok.*;

@ToString
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResourceDTO {
    private Long rrno;
    private String rr_name;
    private String rr_path;
    private String rr_type;
    private Long rno;
    private Long file_size;
    private int rr_ord;

    public ReviewResourceDTO(ReviewResource rr) {
        this.rrno = rr.getRrno();
        this.rr_name = rr.getRr_name();
        this.rr_path = rr.getRr_path();
        this.rr_type = rr.getRr_type();
        this.file_size = rr.getFile_size();
        this.rr_ord = rr.getRr_ord();
        this.rno = rr.getReview().getRno();

    }
}
