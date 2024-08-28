package com.example.running.teamincruit.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"incruitList", "imageSet"})  // toString에서 순환 참조 방지를 위해 제외
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

    @Column(name = "team_members", columnDefinition = "LONGTEXT")
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
    @JsonIgnore  // 이 관계는 JSON 직렬화에서 제외
    private List<Incruit> incruitList;

    @OneToMany(mappedBy = "teamManage",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER,
            orphanRemoval = true)
    @Builder.Default
    @BatchSize(size = 20)
    @JsonManagedReference  // 이미지 데이터를 포함하도록 설정
    @OrderBy("teamManageOrd ASC")  // teamManageOrd 필드로 오름차순 정렬
    private List<TeamManageImg> imageList = new ArrayList<>();

    public void addImage(String uuid, String fileName){
        TeamManageImg teamManageImg = TeamManageImg.builder()
                .teamManageUuid(uuid)
                .teamManageFileName(fileName)
                .teamManage(this)
                .teamManageOrd(imageList.size())  // 이미지 순서 지정
                .build();
        imageList.add(teamManageImg);
    }


    public void clearImages(){
        imageList.forEach(teamManageImg -> teamManageImg.changeBoard(null));
        this.imageList.clear();
    }

    public void change(String teamName, String teamExplain){
        this.teamName = teamName;
        this.teamExplain = teamExplain;
    }
}
