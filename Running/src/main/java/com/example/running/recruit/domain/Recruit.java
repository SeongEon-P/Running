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
    @Column(name = "title", nullable = false, length = 100)
    private String title;

    // 게시글 내용
    @Column(name = "content", nullable = false)
    private String content;

    // 모이는 장소(주소 api 추가용)
    @Column(name = "address", nullable = false)
    private String address;

    // 상세 장소명
    @Column(name = "place", nullable = false)
    private String place;

    // 모이는 날짜
    @Column(name = "date", nullable = false)
    private LocalDate date;

    // 모이는 시간
    @Column(name = "time", nullable = false)
    private LocalTime time;

    // 모집 인원
    @Column(name = "maxnumber", nullable = false)
    private Integer maxnumber;

    // 작성자 -> member의 mid
    @ManyToOne
    @JoinColumn(name = "mid", referencedColumnName = "mid")
    private Member memberRecruit;



    // 게시글 변경
    public void changeRecruit(String title,
                              String content,
                              String address,
                              String place,
                              LocalDate date,
                              LocalTime time,
                              Integer maxnumber) {
        this.title = title;
        this.content = content;
        this.address = address;
        this.place = place;
        this.date = date;
        this.time = time;
        this.maxnumber = maxnumber;
    }

    public void setMember(Member memberRecruit) {
        this.memberRecruit = memberRecruit;
    }

}
