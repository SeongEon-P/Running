package com.example.running.teamincruit.controller;

import com.example.running.teamincruit.domain.TeamManage;
import com.example.running.teamincruit.dto.IncruitDTO;
import com.example.running.teamincruit.dto.TeamManageDTO;
import com.example.running.teamincruit.dto.TeamManageImgDTO;
import com.example.running.teamincruit.repository.TeamManageRepository;
import com.example.running.teamincruit.service.IncruitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Log4j2
@RestController
@RequestMapping("/incruit")
@CrossOrigin(origins = "http://localhost:3000")
public class IncruitController {
    private final IncruitService incruitService;
    private final TeamManageRepository teamManageRepository;
    private final ModelMapper modelMapper;

    @GetMapping("/names")
    public ResponseEntity<List<String>> getTeamNames() {
        List<String> teamNames = teamManageRepository.findAllTeamNames();
        return ResponseEntity.ok(teamNames);
    }

    // 팀 이름으로 팀을 조회하는 메소드 (URL 패턴 변경)
    @GetMapping("/team/{teamName}")
    public ResponseEntity<TeamManageDTO> getTeamByTeamName(@PathVariable String teamName) {
        TeamManage teamManage = teamManageRepository.findByTeamNameWithImages(teamName)
                .orElseThrow(() -> new IllegalArgumentException("해당 팀을 찾을 수 없습니다."));

        TeamManageDTO teamManageDTO = new TeamManageDTO();
        teamManageDTO.setTeamName(teamManage.getTeamName());
        teamManageDTO.setTeamLeader(teamManage.getTeamLeader());
        teamManageDTO.setTeamLogo(teamManage.getTeamLogo());
        teamManageDTO.setTeamExplain(teamManage.getTeamExplain());
        teamManageDTO.setTeamMemberCount(teamManage.getTeamMemberCount());
        teamManageDTO.setTeamMembers(teamManage.getTeamMembers());
        teamManageDTO.setTeamStartdate(teamManage.getTeamStartdate());

        // 연관된 이미지들을 TeamManageImgDTO로 변환
        List<TeamManageImgDTO> imageDTOs = teamManage.getImageList().stream()
                .map(img -> {
                    TeamManageImgDTO imgDTO = new TeamManageImgDTO();
                    imgDTO.setTeamManageUuid(img.getTeamManageUuid());
                    imgDTO.setTeamManageFileName(img.getTeamManageFileName());
                    return imgDTO;
                })
                .collect(Collectors.toList());

        teamManageDTO.setImages(imageDTOs);
        return ResponseEntity.ok(teamManageDTO);
    }

    // 팀 리더로 팀을 조회하는 메소드
    @GetMapping("/team/leader/{teamLeader}")
    public ResponseEntity<TeamManageDTO> getTeamByTeamLeader(@PathVariable String teamLeader) {
        // 팀 리더를 기준으로 팀을 조회
        TeamManage teamManage = teamManageRepository.findByTeamLeaderWithImages(teamLeader)
                .orElseThrow(() -> new IllegalArgumentException("해당 팀을 찾을 수 없습니다."));

        // 팀 정보를 DTO로 변환
        TeamManageDTO teamManageDTO = new TeamManageDTO();
        teamManageDTO.setTeamName(teamManage.getTeamName());
        teamManageDTO.setTeamLeader(teamManage.getTeamLeader());
        teamManageDTO.setTeamLogo(teamManage.getTeamLogo());
        teamManageDTO.setTeamExplain(teamManage.getTeamExplain());
        teamManageDTO.setTeamMemberCount(teamManage.getTeamMemberCount());
        teamManageDTO.setTeamMembers(teamManage.getTeamMembers());
        teamManageDTO.setTeamStartdate(teamManage.getTeamStartdate());

        // 연관된 이미지들을 TeamManageImgDTO로 변환
        List<TeamManageImgDTO> imageDTOs = teamManage.getImageList().stream()
                .map(img -> {
                    TeamManageImgDTO imgDTO = new TeamManageImgDTO();
                    imgDTO.setTeamManageUuid(img.getTeamManageUuid());
                    imgDTO.setTeamManageFileName(img.getTeamManageFileName());
                    return imgDTO;
                })
                .collect(Collectors.toList());

        teamManageDTO.setImages(imageDTOs);
        return ResponseEntity.ok(teamManageDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<Long> registerIncruit(@RequestBody IncruitDTO incruitDTO) {
        Long ino = incruitService.registerIncruit(incruitDTO);
        return ResponseEntity.ok(ino);
    }

    @GetMapping("/list")
    public ResponseEntity<List<IncruitDTO>> getAllIncruit() {
        List<IncruitDTO> incruits = incruitService.getAllIncruit();
        return ResponseEntity.ok(incruits);
    }

    @GetMapping("/{ino}")
    public ResponseEntity<IncruitDTO> getIncruit(@PathVariable Long ino) {
        IncruitDTO incruitDTO = incruitService.getIncruit(ino);
        if (incruitDTO != null) {
            return ResponseEntity.ok(incruitDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{ino}")
    public ResponseEntity<String> modifyIncruit(@PathVariable Long ino, @RequestBody IncruitDTO incruitDTO) {
        try {
            incruitDTO.setIno(ino); // URL에서 받은 ino 값을 설정
            incruitService.modifyIncruit(incruitDTO);
            return ResponseEntity.ok("모집 정보가 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            e.printStackTrace(); // 서버 로그에 오류 출력
            return ResponseEntity.status(500).body("모집 정보 수정 중 오류가 발생했습니다.");
        }
    }

    @DeleteMapping("/{ino}")
    public ResponseEntity<String> removeIncruit(@PathVariable Long ino) {
        try {
            incruitService.removeIncruit(ino);
            return ResponseEntity.ok("삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/increase-views/{ino}")
    public ResponseEntity<Void> increaseViews(@PathVariable Long ino) {
        incruitService.increaseViews(ino);
        return ResponseEntity.ok().build();
    }


}
