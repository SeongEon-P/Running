package com.example.running.teamincruit.controller;

import com.example.running.teamincruit.service.IncruitService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@Log4j2
@RestController
@RequestMapping("/incruit")
@CrossOrigin(origins = "http://localhost:3000")
public class IncruitController {
    private final IncruitService incruitService;


}
