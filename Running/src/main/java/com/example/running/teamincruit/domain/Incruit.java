package com.example.running.teamincruit.domain;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "incruit", indexes = {
        @Index(name = "team_name_fk", columnList = "team_name")})
public class Incruit extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ino")
    private Long ino;

    @Column(name = "icontent", nullable = false, length = 1000)
    private String icontent;

    @Column(name = "ititle", nullable = false, length = 255)
    private String ititle;

    @Column(name = "iwriter", nullable = false, length = 50)
    private String iwriter;

    @Column(name = "iviews", nullable = false, columnDefinition = "INT(11) DEFAULT 0")
    private int iviews;

    @ManyToOne
    @JoinColumn(name = "team_name", referencedColumnName = "team_name", foreignKey = @ForeignKey(name = "team_name_fk"), nullable = false)
    private TeamManage team;

    @Column(name = "team_member_count", nullable = false, columnDefinition = "INT(11) DEFAULT 1")
    private int teamMemberCount;

    @Column(name = "team_members", nullable = false, columnDefinition = "LONGTEXT")
    private String teamMembers;

    @Column(name = "team_startdate")
    private LocalDate teamStartdate;

    @Column(name = "team_explain", length = 500)
    private String teamExplain;

    @Column(name = "team_leader", nullable = false, length = 30)
    private String teamLeader;

    @Column(name = "team_logo", length = 255)
    private String teamLogo;

    @Column(name = "team_level")
    private Integer teamLevel;

    @Column(name = "team_from_pro")
    private Long teamFromPro;
}
