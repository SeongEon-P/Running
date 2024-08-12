package com.example.running.recruit.controller;

import com.example.running.recruit.dto.RecruitDTO;
import com.example.running.recruit.service.RecruitService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/recruit")
@Log4j2
public class RecruitController {

    private final RecruitService recruitService;

    @PostMapping
    public ResponseEntity<Object> register(@RequestBody RecruitDTO recruitDTO) {
        RecruitDTO saveRecruit = recruitService.registerRecruit(recruitDTO);
        return new ResponseEntity<>(saveRecruit, HttpStatus.CREATED);
    }

}
