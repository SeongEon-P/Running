package com.example.running.teamincruit.controller;

import com.example.running.teamincruit.dto.TeamManageDTO;
import com.example.running.teamincruit.service.TeamMangeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@RequiredArgsConstructor
@Log4j2
@RestController
@RequestMapping("/teamManage")
@CrossOrigin(origins = "http://localhost:3000")
public class TeamManageController {
    private final TeamMangeService teamMangeService;
    @Value("${org.zerock.upload.path}")
    private String uploadPath;

    @PostMapping("/register")
    public String registerPOST(@Valid TeamManageDTO teamManageDTO
            , BindingResult bindingResult
            , RedirectAttributes redirectAttributes) {
        log.info("board Post register.......");
        if (bindingResult.hasErrors()) {
            log.info("has errors.......");
            redirectAttributes.addFlashAttribute("errors", bindingResult.getAllErrors());
            return null;
        }
        log.info(teamManageDTO);
        String teamName = teamMangeService.registerTeam(teamManageDTO);
        redirectAttributes.addFlashAttribute("result", teamName);
        return null;
    }

}
