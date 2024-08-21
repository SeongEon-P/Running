package com.example.running.recruit.controller;

import com.example.running.recruit.domain.Recruit;
import com.example.running.recruit.dto.AppliedDTO;
import com.example.running.recruit.dto.RecruitDTO;
import com.example.running.recruit.service.AppliedService;
import com.example.running.recruit.service.RecruitService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/recruit")
@Log4j2
@CrossOrigin(origins = "http://localhost:3000")
public class RecruitController {

    private final RecruitService recruitService;
    private final AppliedService appliedService;

    @PostMapping
    public ResponseEntity<Object> register(@RequestBody RecruitDTO recruitDTO) {
        try {
            // 1. Recruit 엔티티 저장
            RecruitDTO savedRecruit = recruitService.registerRecruit(recruitDTO);
            log.info(savedRecruit.getRno());
            log.info(savedRecruit.getMid());

            // 2. Applied 엔티티 생성 및 저장
            AppliedDTO appliedDTO = new AppliedDTO();
            appliedDTO.setRno(savedRecruit.getRno());
            appliedDTO.setMid(recruitDTO.getMid());

            AppliedDTO saveApplication = appliedService.applicate(appliedDTO);

            // 3. 결과 반환
            return new ResponseEntity<>(saveApplication, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error(e);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/list")
    public ResponseEntity<Object> getAllRecruits(@RequestParam(required = false) String searchKeyword) {
        List<Recruit> recruits;
        if (searchKeyword != null && !searchKeyword.isEmpty()) {
            recruits = recruitService.searchRecruits(searchKeyword);
        } else {
            recruits = recruitService.findAllRecruits();
        }
        return new ResponseEntity<>(recruits, HttpStatus.OK);
    }

    @GetMapping("/read")
    public ResponseEntity<Object> getRecruitById(@RequestParam Long rno) {
        Optional<Recruit> oneRecruit = recruitService.findOneRecruit(rno);

        if(oneRecruit.isPresent()) {
            return ResponseEntity.ok(oneRecruit.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("post not found ------- no : " + rno);
        }
    }

    @PutMapping
    public ResponseEntity<Object> updateRecruit(@RequestBody RecruitDTO recruitDTO) {
        try {
            Recruit modifyRecruit = recruitService.modifyRecruit(recruitDTO);
            return new ResponseEntity<>(modifyRecruit, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            log.error("post not found ------- no : " + recruitDTO.getRno(), e);
            return new ResponseEntity<>("post not found ------- no : " + recruitDTO.getRno(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            log.error("Error modifying recruit post", e);
            return new ResponseEntity<>("Error modifying recruit post", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("{rno}")
    public ResponseEntity<Object> deleteRecruit(@PathVariable Long rno) {
        recruitService.deleteRecruit(rno);
        return new ResponseEntity<>("post deleted successfully", HttpStatus.OK);
    }

}
