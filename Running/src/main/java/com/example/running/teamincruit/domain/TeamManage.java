package com.example.running.teamincruit.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "team_manage", uniqueConstraints = {
        @UniqueConstraint(name = "team_leader", columnNames = "team_leader")})
public class TeamManage extends BaseEntity{

    @Id
    @Column(name = "team_name", length = 30)
    private String teamName;

    @Column(name = "team_member_count", nullable = false, columnDefinition = "INT(11) DEFAULT 1")
    private int teamMemberCount;

    @Column(name = "team_members", nullable = false, columnDefinition = "LONGTEXT")
    private String teamMembers;

    @Column(name = "team_startdate")
    private LocalDate teamStartdate;

    @Column(name = "team_leader", nullable = false, length = 30)
    private String teamLeader;

    @Column(name = "team_logo", length = 255)
    private String teamLogo;

    @Column(name = "team_explain", length = 500)
    private String teamExplain;

    @Column(name = "team_from_pro")
    private Long teamFromPro;

    @Column(name = "team_level")
    private Integer teamLevel;

    @OneToMany(mappedBy = "team")
    private List<Incruit> incruitList;
}
