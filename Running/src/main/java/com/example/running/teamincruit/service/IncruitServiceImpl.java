package com.example.running.teamincruit.service;

import com.example.running.teamincruit.domain.Incruit;
import com.example.running.teamincruit.domain.TeamManage;
import com.example.running.teamincruit.dto.TeamManageImgDTO;
import com.example.running.teamincruit.repository.IncruitRepository;
import com.example.running.teamincruit.dto.IncruitDTO;
import com.example.running.teamincruit.repository.TeamManageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class IncruitServiceImpl implements IncruitService {
    private final IncruitRepository incruitRepository;
    private final TeamManageRepository teamManageRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public Long registerIncruit(IncruitDTO incruitDTO) {
        try {
            // Incruit 엔티티를 수동으로 매핑
            Incruit incruit = new Incruit();
            incruit.setItitle(incruitDTO.getItitle());
            incruit.setIcontent(incruitDTO.getIcontent());
            incruit.setIwriter(incruitDTO.getIwriter());

            // TeamManage 엔티티를 데이터베이스에서 가져와 설정
            TeamManage teamManage = teamManageRepository.findByTeamName(incruitDTO.getTeamName())
                    .orElseThrow(() -> new IllegalArgumentException("팀을 찾을 수 없습니다."));
            incruit.setTeam(teamManage);

            // 필요한 경우 teamManage의 다른 필드를 incruit에 설정
            incruit.setTeamLeader(teamManage.getTeamLeader());
            incruit.setTeamExplain(teamManage.getTeamExplain());
            incruit.setTeamFromPro(teamManage.getTeamFromPro());
            incruit.setTeamLevel(teamManage.getTeamLevel());
            incruit.setTeamLogo(teamManage.getTeamLogo());
            incruit.setTeamMemberCount(teamManage.getTeamMemberCount());
            incruit.setTeamStartdate(teamManage.getTeamStartdate());

            // Incruit 엔티티를 저장하고 생성된 ID 반환
            Long ino = incruitRepository.save(incruit).getIno();
            log.info("등록된 모집 ino: " + ino);
            return ino;
        } catch (Exception e) {
            e.printStackTrace();
            log.error("모집 등록 에러: " + e.getMessage(), e);
            return null;
        }
    }

    @Override
    public IncruitDTO getIncruit(Long ino) {
        Optional<Incruit> incruitOpt = incruitRepository.findById(ino);

        if (incruitOpt.isPresent()) {
            Incruit incruit = incruitOpt.get();

            // Incruit 엔티티를 IncruitDTO로 수동 매핑
            IncruitDTO incruitDTO = IncruitDTO.builder()
                    .ino(incruit.getIno())
                    .ititle(incruit.getItitle())
                    .icontent(incruit.getIcontent())
                    .iwriter(incruit.getIwriter())
                    .regDate(incruit.getRegDate())
                    .iviews(incruit.getIviews())
                    .teamName(incruit.getTeam().getTeamName())
                    .teamExplain(incruit.getTeam().getTeamExplain())
                    .teamLeader(incruit.getTeam().getTeamLeader())
                    .teamMemberCount(incruit.getTeam().getTeamMemberCount())
                    .teamStartdate(incruit.getTeam().getTeamStartdate())
                    .teamLevel(incruit.getTeam().getTeamLevel())
                    .teamFromPro(incruit.getTeam().getTeamFromPro())
                    .build();

            // 이미지 데이터 추가
            List<TeamManageImgDTO> images = incruit.getTeam().getImageSet().stream()
                    .map(img -> TeamManageImgDTO.builder()
                            .teamManageUuid(img.getTeamManageUuid())
                            .teamManageFileName(img.getTeamManageFileName())
                            .teamManageOrd(img.getTeamManageOrd())
                            .build())
                    .collect(Collectors.toList());

            incruitDTO.setImages(images); // IncruitDTO에 이미지 리스트 설정

            return incruitDTO;
        } else {
            log.info("ino에 해당하는 모집이 없습니다." + ino);
            return null;
        }
    }

    @Override
    public void modifyIncruit(IncruitDTO incruitDTO) {
        // 엔티티를 데이터베이스에서 조회
        Optional<Incruit> optionalIncruit = incruitRepository.findById(incruitDTO.getIno());

        if (optionalIncruit.isPresent()) {
            Incruit incruit = optionalIncruit.get();

            // Incruit 엔티티의 필드에 DTO의 데이터를 설정
            incruit.setItitle(incruitDTO.getItitle());
            incruit.setIcontent(incruitDTO.getIcontent());
            incruit.setIwriter(incruitDTO.getIwriter());
            incruit.setIviews(incruitDTO.getIviews());

            // TeamManage 엔티티에 대한 처리 (여기서는 teamName을 통해 조회)
            TeamManage teamManage = teamManageRepository.findByTeamName(incruitDTO.getTeamName())
                    .orElseThrow(() -> new IllegalArgumentException("해당 팀을 찾을 수 없습니다."));

            incruit.setTeam(teamManage);

            // Incruit 엔티티를 저장
            incruitRepository.save(incruit);
        } else {
            throw new IllegalArgumentException("해당 모집 정보를 찾을 수 없습니다.");
        }
    }

    @Override
    public void removeIncruit(Long ino) {
        incruitRepository.deleteById(ino);
    }


    @Override
    public List<IncruitDTO> getAllIncruit() {
        List<Incruit> incruits = incruitRepository.findAll();
        return incruits.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private IncruitDTO convertToDto(Incruit incruit) {
        IncruitDTO incruitDTO = IncruitDTO.builder()
                .ino(incruit.getIno())
                .icontent(incruit.getIcontent())
                .ititle(incruit.getItitle())
                .iwriter(incruit.getIwriter())
                .regDate(incruit.getRegDate())
                .iviews(incruit.getIviews())
                .teamName(incruit.getTeam().getTeamName())
                .teamMemberCount(incruit.getTeamMemberCount())
                .teamStartdate(incruit.getTeamStartdate())
                .teamExplain(incruit.getTeamExplain())
                .teamLeader(incruit.getTeamLeader())
                .teamLogo(incruit.getTeamLogo())
                .teamLevel(incruit.getTeamLevel())
                .teamFromPro(incruit.getTeamFromPro())
                .images(incruit.getTeam().getImageSet().stream()
                        .map(img -> TeamManageImgDTO.builder()
                                .teamManageUuid(img.getTeamManageUuid())
                                .teamManageFileName(img.getTeamManageFileName())
                                .build())
                        .collect(Collectors.toList()))
                .build();
        return incruitDTO;
    }

}
