package com.example.running.Review.domain;


import com.example.running.Notice.domain.NoticeResource;
import com.example.running.member.domain.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rno;
    private String r_title;
    private String r_content;
    private String writer;
    private String r_image;

    @OneToMany(mappedBy = "review",
            cascade = {CascadeType.ALL},
            fetch = FetchType.LAZY,
            orphanRemoval = true)
    @BatchSize(size = 20)
    @Builder.Default
    private Set<ReviewResource> reviewResourceSet = new HashSet<>();

    public void changeNotice(String r_title, String r_content, String r_image, Member member) {
        this.r_title = r_title;
        this.r_content = r_content;
        this.r_image = r_image;
        this.writer = member.getMid();
    }
}

