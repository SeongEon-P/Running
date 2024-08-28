package com.example.running.teamincruit.service;

import com.example.running.teamincruit.domain.TeamManage;
import com.example.running.teamincruit.domain.TeamManageImg;
import com.example.running.teamincruit.dto.TeamManageImgDTO;
import com.example.running.teamincruit.repository.TeamManageImgRepository;
import com.example.running.teamincruit.repository.TeamManageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
@EnableJpaAuditing
public class TeamManageImgServiceImpl implements TeamManageImgService {

    private final TeamManageImgRepository teamManageImgRepository;
    private final TeamManageRepository teamManageRepository;

    @Override
    public void saveUploadedImages(String uuid, String teamName, String fileName, int order) {
        TeamManage teamManage = teamManageRepository.findByTeamName(teamName)
                .orElseThrow(() -> new IllegalArgumentException("Invalid team name: " + teamName));

        TeamManageImg teamManageImg = TeamManageImg.builder()
                .teamManageUuid(uuid)
                .teamManageFileName(fileName)
                .teamManageOrd(order)
                .teamManage(teamManage)
                .build();

        teamManageImgRepository.save(teamManageImg);
    }

    // 팀의 첫 번째 이미지(ord = 0) 가져오기
    @Override
    public Optional<TeamManageImgDTO> getFirstImageForTeam(String teamName) {
        return teamManageImgRepository.findFirstByTeamManageTeamNameOrderByTeamManageOrdAsc(teamName)
                .map(image -> TeamManageImgDTO.builder()
                        .teamManageUuid(image.getTeamManageUuid())
                        .teamManageFileName(image.getTeamManageFileName())
                        .teamManageOrd(image.getTeamManageOrd())
                        .teamName(image.getTeamManage().getTeamName())
                        .build());
    }

    // 특정 팀에 연결된 모든 이미지 가져오기
    @Override
    public List<TeamManageImgDTO> getAllImagesForTeam(String teamName) {
        return teamManageImgRepository.findAllByTeamManageTeamName(teamName).stream()
                .map(image -> TeamManageImgDTO.builder()
                        .teamManageUuid(image.getTeamManageUuid())
                        .teamManageFileName(image.getTeamManageFileName())
                        .teamManageOrd(image.getTeamManageOrd())
                        .teamName(image.getTeamManage().getTeamName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteImageByFileName(String fileName) {
        // 파일명을 기준으로 이미지 데이터 삭제
        teamManageImgRepository.deleteByTeamManageFileName(fileName);
    }
}
