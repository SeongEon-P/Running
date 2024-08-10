package com.example.running.recruit.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "recruit")
@Builder
public class Applied extends BaseEntity {

    @Id
    private Long ano;

    @ManyToOne
    @JoinColumn(name = "rno", referencedColumnName = "rno")
    private Recruit recruit;

//    @ManyToOne
//    @JoinColumn(name = "mid", referencedColumnName = "mid")
//    private Member memberApply;

}
