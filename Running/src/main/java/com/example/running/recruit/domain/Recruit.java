package com.example.running.recruit.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

import java.sql.Time;
import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Recruit extends BaseEntity {

    // 게시글 번호
    @Id
    private Long rno;

    // 게시글 제목
    private String rTitle;
    // 게시글 내용
    private String rContent;
    // 모이는 장소
    private String rPlace;
    // 모이는 날짜
    private LocalDate rDate;
    // 모이는 시간
    private Time rTime;
    // 모집 인원
    private Integer maxNumber;


    // 작성자 -> member의 mid
    //@ManyToOne
    //@JoinColumn(name = "mid", referencedToColumnName = "mid")
    //private Member memberRecruit;

    public void changeRecruit(String rTitle,
                              String rContent,
                              String rPlace,
                              LocalDate rDate,
                              Time rTime,
                              Integer maxNumber) {
        this.rTitle = rTitle;
        this.rContent = rContent;
        this.rPlace = rPlace;
        this.rDate = rDate;
        this.rTime = rTime;
        this.maxNumber = maxNumber;
    }

    //public void setMember(Member member) {
    //this.member = member;
    //}

}
