package com.example.running.teamincruit.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "team_request", uniqueConstraints = {
        @UniqueConstraint(name = "team_leader_request", columnNames = "team_leader")})
public class TeamRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trno")
    private Long trno;  // TeamRequest ID

    @Column(name = "team_name", length = 30, unique = true, nullable = false)
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

    @Column(name = "status", nullable = false)
    private String status;  // "PENDING", "APPROVED", "REJECTED" 등을 표현

    @OneToMany(mappedBy = "teamRequest",
            cascade = {CascadeType.ALL},
            fetch = FetchType.LAZY,
            orphanRemoval = true)
    @Builder.Default
    @BatchSize(size = 20)
    private Set<TeamRequestImg> imageSet = new HashSet<>();

    public void addImage(String uuid, String fileName) {
        TeamRequestImg teamRequestImg = TeamRequestImg.builder()
                .teamRequestUuid(uuid)
                .teamRequestFileName(fileName)
                .teamRequest(this)
                .teamRequestOrd(imageSet.size())
                .build();
        imageSet.add(teamRequestImg);
    }

    public void clearImages() {
        imageSet.forEach(teamRequestImg -> teamRequestImg.changeRequest(null));
        this.imageSet.clear();
    }

    public void change(String teamName, String teamExplain) {
        this.teamName = teamName;
        this.teamExplain = teamExplain;
    }

    public void changeStatus(String status) {
        this.status = status;
    }
}
