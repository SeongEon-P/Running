package com.example.running.teamincruit.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tno")
    private Long tno;

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

    @OneToMany(mappedBy = "team")
    private List<Incruit> incruitList;



    @OneToMany(mappedBy = "teamManage",
            cascade = {CascadeType.ALL},
            fetch = FetchType.LAZY,
            orphanRemoval = true)
    @Builder.Default
    @BatchSize(size = 20)
    private Set<TeamManageImg> imageSet = new HashSet<>();

    public void addImage(String uuid, String fileName){
        TeamManageImg teamManageImg = TeamManageImg.builder()
                .teamManageUuid(uuid)
                .teamManageFileName(fileName)
                .teamManage(this)
                .teamManageOrd(imageSet.size())
                .build();
        imageSet.add(teamManageImg);
    }
    public void clearImages(){
        imageSet.forEach(teamManageImg -> teamManageImg.changeBoard(null));
        this.imageSet.clear();
    }

    public void change(String teamName, String teamExplain){
        this.teamName = teamName;
        this.teamExplain = teamExplain;
    }
}


