package com.example.running.teamincruit.service;

import com.example.running.teamincruit.domain.TeamManage;
import com.example.running.teamincruit.dto.TeamManageDTO;
import com.example.running.teamincruit.repository.TeamManageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
//@EnableJpaAuditing
public class TeamManageServiceImpl implements TeamManageService {
    private final TeamManageRepository teamManageRepository;
    private final ModelMapper modelMapper;

    @Override
    public String registerTeam(TeamManageDTO teamManageDTO) {
        // teamName이 null이거나 빈 문자열인 경우 예외를 던집니다.
        if (teamManageDTO.getTeamName() == null || teamManageDTO.getTeamName().trim().isEmpty()) {
            throw new IllegalArgumentException("Team name must be provided and cannot be empty");
        }

        try {
            // 수동으로 DTO를 Entity로 매핑
            TeamManage teamManage = new TeamManage();
            teamManage.setTeamName(teamManageDTO.getTeamName());
            teamManage.setTeamMemberCount(teamManageDTO.getTeamMemberCount());
            teamManage.setTeamMembers(teamManageDTO.getTeamMembers());
            teamManage.setTeamStartdate(teamManageDTO.getTeamStartdate());
            teamManage.setTeamLeader(teamManageDTO.getTeamLeader());
            teamManage.setTeamLogo(teamManageDTO.getTeamLogo());
            teamManage.setTeamExplain(teamManageDTO.getTeamExplain());
            teamManage.setTeamFromPro(teamManageDTO.getTeamFromPro());
            teamManage.setTeamLevel(teamManageDTO.getTeamLevel());

            // teamManage 엔티티를 데이터베이스에 저장합니다.
            teamManageRepository.save(teamManage);

            // 저장된 팀 이름을 반환합니다.
            return teamManage.getTeamName();
        } catch (Exception e) {
            // 예외 발생 시 스택 트레이스를 출력하고 로그에 에러를 기록합니다.
            e.printStackTrace();
            log.error("팀 등록 에러: " + e.getMessage(), e);
            return null;
        }
    }

    @Override
    public TeamManageDTO getTeam(String teamName) {
        Optional<TeamManage> teamManage = teamManageRepository.findByTeamName(teamName);

        if (teamManage.isPresent()) {
            TeamManageDTO teamManageDTO = modelMapper.map(teamManage.get(), TeamManageDTO.class);
            return teamManageDTO;
        } else {
            log.info("teamName에 해당하는 팀이 없습니다 : " + teamName);
            return null;
        }
    }


    @Override
    public void modifyTeam(TeamManageDTO teamManageDTO) {
        Optional<TeamManage> optionalTeamManage = teamManageRepository.findById(teamManageDTO.getTno());

        if (optionalTeamManage.isPresent()) {
            TeamManage teamManage = optionalTeamManage.get();
            modelMapper.map(teamManageDTO, teamManage);
            teamManageRepository.save(teamManage);
        } else {
            throw new IllegalArgumentException("존재하지 않는 팀입니다: " + teamManageDTO.getTno());
        }
    }


    @Override
    public void removeTeam(Long tno) {
        teamManageRepository.deleteById(tno);
    }

    @Override
    public List<TeamManageDTO> getAllTeam() {
        List<TeamManage> teamManages = teamManageRepository.findAll();
        return teamManages.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private TeamManageDTO convertToDto(TeamManage teamManage) {
        return TeamManageDTO.builder()
                .teamName(teamManage.getTeamName())
                .teamMemberCount(teamManage.getTeamMemberCount())
                .teamMembers(teamManage.getTeamMembers())
                .teamStartdate(teamManage.getTeamStartdate())
                .teamLeader(teamManage.getTeamLeader())
                .teamLogo(teamManage.getTeamLogo())
                .teamExplain(teamManage.getTeamExplain())
                .teamFromPro(teamManage.getTeamFromPro())
                .teamLevel(teamManage.getTeamLevel())
                .build();
    }
}
