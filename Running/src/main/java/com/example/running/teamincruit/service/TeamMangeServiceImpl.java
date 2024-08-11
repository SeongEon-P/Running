package com.example.running.teamincruit.service;

import com.example.running.teamincruit.domain.TeamManage;
import com.example.running.teamincruit.dto.TeamManageDTO;
import com.example.running.teamincruit.repository.TeamManageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
@EnableJpaAuditing
public class TeamMangeServiceImpl implements TeamMangeService {
    private final TeamManageRepository teamManageRepository;
    private final ModelMapper modelMapper;

    @Override
    public String registerTeam(TeamManageDTO teamManageDTO) {
        try {
            TeamManage teamManage = modelMapper.map(teamManageDTO, TeamManage.class);
            teamManage = teamManageRepository.save(teamManage);

            // 이 시점에서 regDate가 설정되었는지 확인하고, 설정되었다면 teamStartdate를 동기화합니다.
            if (teamManage.getRegDate() != null) {
                teamManage.setTeamStartdate(teamManage.getRegDate().toLocalDate());
                teamManage = teamManageRepository.save(teamManage);
            } else {
                log.warn("regDate가 설정되지 않았습니다.");
            }

            return teamManage.getTeamName();
        } catch (Exception e) {
            e.printStackTrace();
            log.error("팀 등록 에러: " + e.getMessage(), e);
            return null;
        }
    }


    @Override
    public TeamManageDTO getTeam(String team_name) {

        Optional<TeamManage> teamManage = teamManageRepository.findById(team_name);

        if (teamManage.isPresent()) {
            TeamManageDTO teamManageDTO = modelMapper.map(teamManage.get(), TeamManageDTO.class);
            return teamManageDTO;
        } else {
            log.info("team_name에 해당하는 팀이 없습니다 : " + team_name);
            return null;
        }
    }

    @Override
    public void modifyTeam(TeamManageDTO teamManageDTO) {
        TeamManage teamManage = modelMapper.map(teamManageDTO, TeamManage.class);
        teamManageRepository.save(teamManage);
    }

    @Override
    public void removeTeam(String team_name) {
        teamManageRepository.deleteById(team_name);
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
