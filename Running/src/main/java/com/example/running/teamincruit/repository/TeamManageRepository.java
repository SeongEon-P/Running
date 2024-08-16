package com.example.running.teamincruit.repository;

import com.example.running.teamincruit.domain.TeamManage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamManageRepository extends JpaRepository<TeamManage, Long> {

    // teamName을 기준으로 TeamManage 엔티티를 조회하는 메서드
    Optional<TeamManage> findByTeamName(String teamName);
}
