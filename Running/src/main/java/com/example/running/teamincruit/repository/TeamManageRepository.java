package com.example.running.teamincruit.repository;

import com.example.running.teamincruit.domain.TeamManage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TeamManageRepository extends JpaRepository<TeamManage, Long> {

    // teamName을 기준으로 TeamManage 엔티티를 조회하는 메서드
    Optional<TeamManage> findByTeamName(String teamName);
    Optional<TeamManage> findByTeamLeader(String teamLeader);
    Optional<TeamManage> findByTeamMembersContaining(String teamMember);

    @Query("SELECT tm.teamName FROM TeamManage tm")
    List<String> findAllTeamNames();

    @Query("SELECT tm FROM TeamManage tm LEFT JOIN FETCH tm.imageList WHERE tm.teamName = :teamName")
    Optional<TeamManage> findByTeamNameWithImages(@Param("teamName") String teamName);

    @Query("SELECT tm FROM TeamManage tm LEFT JOIN FETCH tm.imageList WHERE tm.teamLeader = :teamLeader")
    Optional<TeamManage> findByTeamLeaderWithImages(@Param("teamLeader") String teamLeader);

}
