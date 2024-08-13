package com.example.running.teamincruit.service;

import com.example.running.teamincruit.domain.TeamManage;
import com.example.running.teamincruit.domain.TeamManageImg;
import com.example.running.teamincruit.repository.TeamManageImgRepository;
import com.example.running.teamincruit.repository.TeamManageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
@EnableJpaAuditing
public class TeamManageImgServiceImpl implements TeamManageImgService {

    private final TeamManageImgRepository teamManageImgRepository;
    private final TeamManageRepository teamManageRepository;

    @Override
    public void saveUploadedImages(String teamName, String fileName, int order) {
        TeamManage teamManage = teamManageRepository.findByTeamName(teamName)
                .orElseThrow(() -> new IllegalArgumentException("Invalid team name: " + teamName));

        TeamManageImg teamManageImg = TeamManageImg.builder()
                .teamManageUuid(UUID.randomUUID().toString())
                .teamManageFileName(fileName)
                .teamManageOrd(order)
                .teamManage(teamManage)
                .build();

        teamManageImgRepository.save(teamManageImg);
    }
}
