package com.example.running.teamincruit.service;

import com.example.running.teamincruit.domain.TeamManage;
import com.example.running.teamincruit.domain.TeamManageImg;
import com.example.running.teamincruit.dto.TeamManageDTO;
import com.example.running.teamincruit.repository.TeamManageImgRepository;
import com.example.running.teamincruit.repository.TeamManageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
//@EnableJpaAuditing
public class TeamManageServiceImpl implements TeamManageService {
    private final TeamManageRepository teamManageRepository;
    private final TeamManageImgRepository teamManageImgRepository;
    private final ModelMapper modelMapper;

    @Value("${org.zerock.upload.path}")
    private String uploadPath;

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


    @Transactional
    @Override
    public void removeTeam(Long tno) {
        // tno로 팀 정보 가져오기
        TeamManage teamManage = teamManageRepository.findById(tno)
                .orElseThrow(() -> new IllegalArgumentException("팀을 찾을 수 없습니다."));

        String teamName = teamManage.getTeamName();

        // 팀에 연관된 이미지 파일 가져오기
        List<TeamManageImg> images = teamManageImgRepository.findAllByTeamManageTeamName(teamName);

        // 이미지 파일 삭제
        for (TeamManageImg img : images) {
            String filePath = uploadPath + File.separator + img.getTeamManageFileName();
            try {
                Files.deleteIfExists(Paths.get(filePath)); // 파일 삭제
            } catch (IOException e) {
                e.printStackTrace(); // 로그 남기기
            }
        }

        // 팀과 연관된 모든 이미지 정보 삭제
        teamManageImgRepository.deleteAllByTeamManageTeamName(teamName);

        // 팀 데이터 삭제
        teamManageRepository.delete(teamManage);   // DB에서 팀 삭제
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
