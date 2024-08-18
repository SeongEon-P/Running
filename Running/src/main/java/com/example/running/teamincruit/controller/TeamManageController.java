package com.example.running.teamincruit.controller;

import com.example.running.teamincruit.dto.TeamManageDTO;
import com.example.running.teamincruit.dto.TeamManageImgDTO;
import com.example.running.teamincruit.repository.TeamManageRepository;
import com.example.running.teamincruit.service.TeamManageImgService;
import com.example.running.teamincruit.service.TeamManageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Log4j2
@RestController
@RequestMapping("/team")
@CrossOrigin(origins = "http://localhost:3000")
public class TeamManageController {
    private final TeamManageService teamManageService;
    private final TeamManageImgService teamManageImgService;
    private final TeamManageRepository teamManageRepository;

    @PostMapping("/register")
    public ResponseEntity<String> registerTeam(@RequestBody TeamManageDTO teamManageDTO) {
        String teamName = teamManageService.registerTeam(teamManageDTO);
        return ResponseEntity.ok(teamName); // 팀 이름을 반환하여 이후 이미지 업로드에 사용
    }

    // 모든 팀을 가져올 때 첫 번째 이미지(ord = 0)만 가져오기
    @GetMapping("/all")
    public ResponseEntity<List<TeamManageDTO>> getAllTeams() {
        log.info("모든 팀 가져오기");

        List<TeamManageDTO> teamManageDTOList = teamManageService.getAllTeam();

        if (!teamManageDTOList.isEmpty()) {
            // 각 팀에 첫 번째 이미지(ord = 0)를 첨부
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

    // 특정 팀의 세부 정보와 모든 이미지 가져오기
    @GetMapping("/{teamName}")
    public ResponseEntity<TeamManageDTO> getTeamByName(@PathVariable("teamName") String teamName) {
        log.info("팀 세부 정보 가져오기: {}", teamName);

        TeamManageDTO teamManageDTO = teamManageService.getTeam(teamName);

        if (teamManageDTO != null) {
            // 해당 팀에 연결된 모든 이미지 첨부
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
            return ResponseEntity.noContent().build(); // 성공 시 204 No Content 응답
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 실패 시 500 Internal Server Error 응답
        }
    }


}
