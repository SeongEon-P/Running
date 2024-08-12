package com.example.running.Notice.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"noticeResourceSet", "member"})
@Builder
public class Notice extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nno;
    private String n_title;
    private String n_content;
    private String writer;
    private String n_image;

    @OneToMany(mappedBy = "notice",
            cascade = {CascadeType.ALL},
            fetch = FetchType.LAZY,
            orphanRemoval = true)
    @BatchSize(size = 20)
    @Builder.Default
    private Set<NoticeResource> noticeResourceSet = new HashSet<>();

    public void changeNotice(String n_title, String n_content, String n_image) {
        this.n_title = n_title;
        this.n_content = n_content;
        this.n_image = n_image;
    }
}