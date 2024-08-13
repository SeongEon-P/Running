package com.example.running.recruit.controller;

import com.example.running.recruit.dto.AppliedDTO;
import com.example.running.recruit.service.AppliedService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/apply")
@Log4j2
public class AppliedController {

    private final AppliedService appliedService;

    @PostMapping
    public ResponseEntity<Object> apply(@RequestBody AppliedDTO appliedDTO) {
        AppliedDTO saveApplication = appliedService.applicate(appliedDTO);
        return new ResponseEntity<>(saveApplication, HttpStatus.CREATED);
    }

}
