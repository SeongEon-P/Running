package com.example.running.teamincruit.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "team_request_img", indexes = {
        @Index(name = "team_request_team_name_idx", columnList = "team_name")})
public class TeamRequestImg implements Comparable<TeamRequestImg> {

    @Id
    @Column(name = "team_request_uuid", length = 200)
    private String teamRequestUuid;

    @Column(name = "team_request_file_name", nullable = false, length = 200)
    private String teamRequestFileName;

    @Column(name = "team_request_ord", nullable = false)
    private int teamRequestOrd;

    @ManyToOne
    @JoinColumn(name = "team_name", referencedColumnName = "team_name", foreignKey = @ForeignKey(name = "team_request_team_name_fk"), nullable = false)
    private TeamRequest teamRequest;

    @Override
    public int compareTo(TeamRequestImg other) {
        return this.teamRequestOrd - other.teamRequestOrd;
    }

    public void changeRequest(TeamRequest teamRequest) {
        this.teamRequest = teamRequest;
    }
}
