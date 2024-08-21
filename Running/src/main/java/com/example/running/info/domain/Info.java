package com.example.running.info.domain;

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
public class Info extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ino;
    private String i_title;
    private String i_content;
    private String writer;
    private String i_image;

    @OneToMany(mappedBy = "info",
            cascade = {CascadeType.ALL},
            fetch = FetchType.LAZY,
            orphanRemoval = true)
    @BatchSize(size = 20)
    @Builder.Default
    private Set<InfoResource> infoResourceSet = new HashSet<>();

    public void changeInfo(String i_title, String i_content, String i_image, Member member) {
        this.i_title = i_title;
        this.i_content = i_content;
        this.i_image = i_image;
        this.writer = member.getMid();
    }
}
