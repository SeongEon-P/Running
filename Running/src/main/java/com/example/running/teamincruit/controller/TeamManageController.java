package com.example.running.teamincruit.controller;

import com.example.running.teamincruit.domain.TeamRequest;
import com.example.running.teamincruit.domain.TeamRequestImg;
import com.example.running.teamincruit.dto.TeamManageDTO;
import com.example.running.teamincruit.dto.TeamManageImgDTO;
import com.example.running.teamincruit.dto.TeamRequestDTO;
import com.example.running.teamincruit.service.TeamManageImgService;
import com.example.running.teamincruit.service.TeamManageService;
import com.example.running.teamincruit.service.TeamRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Log4j2
@RestController
@RequestMapping("/team")
@CrossOrigin(origins = "http://localhost:3000")
public class TeamManageController {

    private final TeamManageService teamManageService;
    private final TeamManageImgService teamManageImgService;
    private final TeamRequestService teamRequestService;

    // 팀 생성 요청을 임시 저장소에 저장
    @PostMapping("/register")
    public ResponseEntity<String> registerTeam(
            @RequestPart("teamData") TeamRequestDTO teamRequestDTO,
            @RequestPart("images") List<MultipartFile> images) {
        try {
            // 팀 생성 요청 처리 로직
            TeamRequest teamRequest = new TeamRequest();
            // DTO의 데이터를 TeamRequest 엔티티로 변환
            teamRequest.setTeamName(teamRequestDTO.getTeamName());
            teamRequest.setTeamLeader(teamRequestDTO.getTeamLeader());
            teamRequest.setTeamMemberCount(teamRequestDTO.getTeamMemberCount());
            teamRequest.setTeamMembers(teamRequestDTO.getTeamMembers());
            teamRequest.setTeamStartdate(teamRequestDTO.getTeamStartdate());
            teamRequest.setTeamLogo(teamRequestDTO.getTeamLogo());
            teamRequest.setTeamExplain(teamRequestDTO.getTeamExplain());
            teamRequest.setTeamFromPro(teamRequestDTO.getTeamFromPro());
            teamRequest.setTeamLevel(teamRequestDTO.getTeamLevel());

            // 여기서 status를 PENDING으로 설정
            teamRequest.setStatus("PENDING");

            // 이미지 파일 저장 경로 설정
            String uploadPath = "C:\\upload";

            // 이미지 파일 저장
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String uuid = UUID.randomUUID().toString();
                    String fileName = uuid + "_" + image.getOriginalFilename();

                    // 파일 저장 경로 + 파일명 설정
                    File saveFile = new File(uploadPath, fileName);

                    try {
                        // 파일 저장
                        image.transferTo(saveFile);

                        // TeamRequest에 이미지 추가
                        teamRequest.addImage(uuid, fileName);
                    } catch (IOException e) {
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 저장 중 오류가 발생했습니다.");
                    }
                }
            }

            // TeamRequest를 DB에 저장
            teamRequestService.createTeamRequest(teamRequest);

            return ResponseEntity.ok("팀 생성 요청이 성공적으로 제출되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("팀 생성 요청 처리 중 오류가 발생했습니다.");
        }
    }


    @GetMapping("/all")
    public ResponseEntity<List<TeamManageDTO>> getAllTeams() {
        log.info("모든 팀 가져오기");

        List<TeamManageDTO> teamManageDTOList = teamManageService.getAllTeam();

        if (!teamManageDTOList.isEmpty()) {
            for (TeamManageDTO team : teamManageDTOList) {
                Optional<TeamManageImgDTO> firstImage = teamManageImgService.getFirstImageForTeam(team.getTeamName());
                firstImage.ifPresent(image -> team.setTeamLogo(image.getTeamManageFileName()));
            }
            return ResponseEntity.ok(teamManageDTOList);
        } else {
            log.warn("팀이 존재하지 않습니다.");
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/{teamName}")
    public ResponseEntity<TeamManageDTO> getTeamByName(@PathVariable("teamName") String teamName) {
        log.info("팀 세부 정보 가져오기: {}", teamName);

        TeamManageDTO teamManageDTO = teamManageService.getTeam(teamName);

        if (teamManageDTO != null) {
            List<TeamManageImgDTO> images = teamManageImgService.getAllImagesForTeam(teamManageDTO.getTeamName());
            teamManageDTO.setImages(images);
            return ResponseEntity.ok(teamManageDTO);
        } else {
            log.warn("해당 이름의 팀을 찾을 수 없습니다: {}", teamName);
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{teamName}")
    public ResponseEntity<?> updateTeam(@PathVariable String teamName, @RequestBody TeamManageDTO teamManageDTO) {
        try {
            teamManageService.modifyTeam(teamManageDTO);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정 중 오류가 발생했습니다.");
        }
    }

    @DeleteMapping("/{tno}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long tno) {
        try {
            teamManageService.removeTeam(tno);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 팀 요청 목록 가져오기
    @GetMapping("/request/list")
    public ResponseEntity<List<TeamRequestDTO>> getAllPendingRequests() {
        List<TeamRequestDTO> pendingRequests = teamRequestService.getAllPendingRequests();
        if (pendingRequests.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(pendingRequests);
        }
    }

    // 팀 요청 승인
    @PostMapping("/request/approve/{requestId}")
    public ResponseEntity<Void> approveTeamRequest(@PathVariable Long requestId) {
        try {
            teamRequestService.approveTeam(requestId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 팀 요청 거절
    @PostMapping("/request/reject/{requestId}")
    public ResponseEntity<Void> rejectTeamRequest(@PathVariable Long requestId) {
        try {
            teamRequestService.rejectTeam(requestId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
