package com.example.running.Notice.domain;

import com.example.running.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notice extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nno;
    private String n_title;
    private String n_content;
    private String writer;
    private String n_image;
    private boolean important;

    @Column(name = "view_count", nullable = false)
    private int viewCount = 0;

    @OneToMany(mappedBy = "notice",
            cascade = {CascadeType.ALL},
            fetch = FetchType.LAZY,
            orphanRemoval = true)
    @BatchSize(size = 20)
    @Builder.Default
    private Set<NoticeResource> noticeResourceSet = new HashSet<>();

    public void changeNotice(String n_title, String n_content, String n_image, Member member) {
        this.n_title = n_title;
        this.n_content = n_content;
        this.n_image = n_image;
        this.writer = member.getMid();
    }

    // 중요 공지사항 설정 메서드 추가
    public void markAsImportant(boolean important) {
        this.important = important;
    }

    public void incrementViewCount() {
        this.viewCount++;
    }
}
