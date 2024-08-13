package com.example.running.teamManageTest;

import com.example.running.teamincruit.domain.TeamManage;
import com.example.running.teamincruit.dto.TeamManageDTO;
import com.example.running.teamincruit.repository.TeamManageRepository;
import com.example.running.teamincruit.service.TeamManageServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class TeamManageTest {

    @Autowired
    private TeamManageServiceImpl teamMangeService;

    @Autowired
    private TeamManageRepository teamManageRepository;

    private TeamManageDTO teamManageDTO;

    @BeforeEach
    public void setup() {
        // 테스트를 위한 데이터 초기화
        teamManageDTO = TeamManageDTO.builder()
                .teamName("TestTeam")
                .teamMemberCount(10)
                .teamMembers("John, Jane")
                .teamStartdate(null)
                .teamLeader("John Doe")
                .teamLogo("logo.png")
                .teamExplain("Test Team Explanation")
                .teamFromPro(null)
                .teamLevel(1)
                .build();

        // 테스트 데이터가 이미 존재할 수 있으므로 먼저 제거
        teamManageRepository.deleteById("TestTeam");
    }

    @Test
    public void testRegisterTeam() {
        String teamName = teamMangeService.registerTeam(teamManageDTO);

        assertNotNull(teamName);

        // 데이터베이스에 팀이 실제로 저장되었는지 확인
        TeamManage savedTeam = teamManageRepository.findById(teamName).orElse(null);
        assertNotNull(savedTeam);

        // regDate와 teamStartdate가 올바르게 설정되었는지 확인
        assertNotNull(savedTeam.getRegDate(), "regDate is null");
        assertNotNull(savedTeam.getTeamStartdate(), "teamStartdate is null");
        assertEquals(savedTeam.getRegDate().toLocalDate(), savedTeam.getTeamStartdate());
    }
}

