package com.example.running.teamincruit.repository;

import com.example.running.teamincruit.domain.TeamRequest;
import com.example.running.teamincruit.dto.TeamRequestDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TeamRequestRepository extends JpaRepository<TeamRequest, Long> {

    // 특정 상태에 해당하는 팀 요청 목록을 조회하는 메서드
    @Query("SELECT new com.example.running.teamincruit.dto.TeamRequestDTO(t.trno, t.teamName, t.teamMemberCount, t.teamMembers, t.teamStartdate, " +
            "t.teamLeader, t.teamLogo, t.teamExplain, t.teamFromPro, t.teamLevel, t.status) " +
            "FROM TeamRequest t WHERE LOWER(t.status) = LOWER(:status)")
    List<TeamRequestDTO> findByStatus(@Param("status") String status);



}
