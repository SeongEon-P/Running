package com.example.running.teamincruit.controller;

import com.example.running.teamincruit.dto.TeamManageDTO;
import com.example.running.teamincruit.service.TeamManageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@RequiredArgsConstructor
@Log4j2
@RestController
@RequestMapping("/teamManage")
@CrossOrigin(origins = "http://localhost:3000")
public class TeamManageController {
    private final TeamManageService teamManageService;
    @Value("${org.zerock.upload.path}")
    private String uploadPath;

    @PostMapping("/register")
    public ResponseEntity<String> registerTeam(@RequestBody TeamManageDTO teamManageDTO) {
        String teamName = teamManageService.registerTeam(teamManageDTO);
        return ResponseEntity.ok(teamName); // 팀 이름을 반환하여 이후 이미지 업로드에 사용
    }

}
