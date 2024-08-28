package com.example.running.teamincruit.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "team_manage_img", indexes = {
        @Index(name = "team_manage_team_name_idx", columnList = "team_name")})
public class TeamManageImg implements Comparable<TeamManageImg>{

    @Id
    @Column(name = "team_manage_uuid", length = 200)
    private String teamManageUuid;

    @Column(name = "team_manage_file_name", nullable = false, length = 200)
    private String teamManageFileName;

    @Column(name = "team_manage_ord", nullable = false)
    private int teamManageOrd;

    @ManyToOne
    @JoinColumn(name = "team_name", referencedColumnName = "team_name", foreignKey = @ForeignKey(name = "team_manage_team_name_fk"), nullable = false)
    @JsonBackReference
    private TeamManage teamManage;

    @Override
    public int compareTo(TeamManageImg other) {
        return this.teamManageOrd - other.teamManageOrd;
    }

    public void changeBoard(TeamManage teamManage){
        this.teamManage = teamManage;
    }
}
