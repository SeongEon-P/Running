package com.example.running.teamincruit.repository;

import com.example.running.teamincruit.domain.TeamManageImg;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamManageImgRepository extends JpaRepository<TeamManageImg, String> {

    // 팀 이름으로 첫 번째 이미지 가져오기 (ord = 0)
    Optional<TeamManageImg> findFirstByTeamManageTeamNameOrderByTeamManageOrdAsc(String teamName);

    // 특정 팀에 연결된 모든 이미지 가져오기
    List<TeamManageImg> findAllByTeamManageTeamName(String teamName);

    void deleteByTeamManageFileName(String fileName);

    void deleteAllByTeamManageTeamName(String teamName);


}
