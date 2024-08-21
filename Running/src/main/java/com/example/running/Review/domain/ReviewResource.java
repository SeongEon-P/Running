package com.example.running.Review.domain;

import com.example.running.Notice.domain.Notice;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "review")
public class ReviewResource implements Comparable<ReviewResource> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rrno;
    private String rr_name;
    private String rr_path;
    private String rr_type;
    private Long file_size;
    private int rr_ord;

    @Override
    public int compareTo(ReviewResource o) {
        return this.rr_ord - o.rr_ord;
    }
    @ManyToOne
    @JoinColumn(name = "rno", referencedColumnName = "rno")
    private Review review;
}
