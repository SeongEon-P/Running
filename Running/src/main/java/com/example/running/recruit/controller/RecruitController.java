package com.example.running.recruit.controller;

import com.example.running.recruit.domain.Recruit;
import com.example.running.recruit.dto.RecruitDTO;
import com.example.running.recruit.service.RecruitService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;
import java.util.Optional;

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

    @GetMapping("/list")
    public ResponseEntity<Object> getAllRecruits() {
        return new ResponseEntity<>(recruitService.findAllRecruits(), HttpStatus.OK);
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
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
