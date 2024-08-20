package com.example.running.recruit.domain;

import com.example.running.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "memberRecruit")
@Builder
public class Recruit extends BaseEntity {

    // 게시글 번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rno;

    // 게시글 제목
    @Column(name = "r_title", nullable = false, length = 100)
    private String r_title;

    // 게시글 내용
    @Column(name = "r_content", nullable = false)
    private String r_content;

    // 모이는 장소(주소 api 추가용)
    @Column(name = "r_place", nullable = false)
    private String r_place;

    // 상세 장소명
    @Column(name = "r_place2", nullable = false)
    private String r_place2;

    // 모이는 날짜
    @Column(name = "r_date", nullable = false)
    private LocalDate r_date;

    // 모이는 시간
    @Column(name = "r_time", nullable = false)
    private LocalTime r_time;

    // 모집 인원
    @Column(name = "max_number", nullable = false)
    private Integer max_number;

    // 작성자 -> member의 mid
    @ManyToOne
    @JoinColumn(name = "mid", referencedColumnName = "mid")
    private Member memberRecruit;



    // 게시글 변경
    public void changeRecruit(String r_title,
                              String r_content,
                              String r_place,
                              String r_place2,
                              LocalDate r_date,
                              LocalTime r_time,
                              Integer max_number) {
        this.r_title = r_title;
        this.r_content = r_content;
        this.r_place = r_place;
        this.r_place2 = r_place2;
        this.r_date = r_date;
        this.r_time = r_time;
        this.max_number = max_number;
    }

    public void setMember(Member memberRecruit) {
        this.memberRecruit = memberRecruit;
    }

}
