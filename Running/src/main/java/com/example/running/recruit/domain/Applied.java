package com.example.running.recruit.domain;

import com.example.running.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"recruit", "memberApply"})
@Builder
public class Applied extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ano;

    @ManyToOne
    @JoinColumn(name = "rno", referencedColumnName = "rno")
    private Recruit recruit;

    @ManyToOne
    @JoinColumn(name = "mid", referencedColumnName = "mid")
    private Member memberApply;

}
