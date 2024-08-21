package com.example.running.teamincruit.service;

import com.example.running.member.domain.Member;
import com.example.running.member.domain.Role;
import com.example.running.member.repositroy.MemberRepository;
import com.example.running.member.service.MemberService;
import com.example.running.teamincruit.domain.TeamManage;
import com.example.running.teamincruit.domain.TeamManageImg;
import com.example.running.teamincruit.domain.TeamRequest;
import com.example.running.teamincruit.domain.TeamRequestImg;
import com.example.running.teamincruit.dto.TeamRequestDTO;
import com.example.running.teamincruit.repository.TeamManageRepository;
import com.example.running.teamincruit.repository.TeamRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class TeamRequestServiceImpl implements TeamRequestService {
    private final TeamRequestRepository teamRequestRepository;
    private final TeamManageRepository teamManageRepository;
    private final MemberService memberService;
    private final MemberRepository memberRepository;

    @Override
    public void createTeamRequest(TeamRequest teamRequest) {
        teamRequestRepository.save(teamRequest);
    }

    @Override
    public List<TeamRequestDTO> getAllPendingRequests() {
        return teamRequestRepository.findByStatus("PENDING");
    }

    @Override
    @Transactional
    public void approveTeam(Long requestId) {
        // 팀 요청을 가져옴
        TeamRequest teamRequest = teamRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid request ID"));

        // 팀을 실제 테이블로 이동 (TeamManage에 저장)
        TeamManage teamManage = new TeamManage();
        teamManage.setTeamName(teamRequest.getTeamName());
        teamManage.setTeamLeader(teamRequest.getTeamLeader());
        teamManage.setTeamMemberCount(teamRequest.getTeamMemberCount());
        teamManage.setTeamMembers(teamRequest.getTeamMembers());
        teamManage.setTeamStartdate(teamRequest.getTeamStartdate());
        teamManage.setTeamLogo(teamRequest.getTeamLogo());
        teamManage.setTeamExplain(teamRequest.getTeamExplain());
        teamManage.setTeamFromPro(teamRequest.getTeamFromPro());
        teamManage.setTeamLevel(teamRequest.getTeamLevel());

        // 이미지 설정 - TeamRequestImg에서 TeamManageImg로 이미지 이동
        for (TeamRequestImg requestImg : teamRequest.getImageSet()) {
            teamManage.addImage(
                    requestImg.getTeamRequestUuid(),
                    requestImg.getTeamRequestFileName()
            );
        }

        // 실제 팀 데이터 저장
        teamManageRepository.save(teamManage);

        // 팀 리더의 역할을 LEADER로 업데이트
        String teamLeaderName = teamRequest.getTeamLeader();  // 팀 리더의 이름
        System.out.println("Updating role for team leader with name: " + teamLeaderName);

        // name을 기준으로 회원 검색
        Optional<Member> optionalMember = memberRepository.findByName(teamLeaderName);
        if(optionalMember.isPresent()) {
            Member member = optionalMember.get();
            memberService.updateRole(member.getMid(), Role.LEADER);  // 역할을 LEADER로 변경
        } else {
            System.err.println("Failed to update role for team leader: 해당 이름을 가진 회원을 찾을 수 없습니다.");
        }

        // 팀 요청 테이블에서 데이터 삭제 (이미지 포함)
        teamRequestRepository.deleteById(requestId);

        System.out.println("Team successfully approved and moved to TeamManage table.");
    }


    @Override
    public void rejectTeam(Long requestId) {
        TeamRequest teamRequest = teamRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid request ID"));
        teamRequest.setStatus("REJECTED");
        teamRequestRepository.save(teamRequest);
    }
}
