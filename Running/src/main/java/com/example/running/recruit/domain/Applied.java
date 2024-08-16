package com.example.running.recruit.domain;

import com.example.running.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"recruitApply", "memberApply"})
@Builder
public class Applied extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ano;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "rno", referencedColumnName = "rno")
    private Recruit recruitApply;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "mid", referencedColumnName = "mid")
    private Member memberApply;

    public void setRecruit(Recruit recruitApply) {
        this.recruitApply = recruitApply;
    }

    public void setMember(Member memberApply) {
        this.memberApply = memberApply;
    }

}
