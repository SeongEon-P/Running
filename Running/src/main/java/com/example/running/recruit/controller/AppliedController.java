package com.example.running.recruit.controller;

import com.example.running.recruit.domain.Applied;
import com.example.running.recruit.dto.AppliedDTO;
import com.example.running.recruit.service.AppliedService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/apply")
@Log4j2
public class AppliedController {

    private final AppliedService appliedService;

    // 신청하기
    @PostMapping
    public ResponseEntity<Object> apply(@RequestBody AppliedDTO appliedDTO) {
        AppliedDTO saveApplication = appliedService.applicate(appliedDTO);
        return new ResponseEntity<>(saveApplication, HttpStatus.CREATED);
    }

    // 신청한 사람 목록
    @GetMapping
    public ResponseEntity<Object> getListByRno(@RequestParam Long rno) {
        List<Applied> onePost = appliedService.getAppliedByRno(rno);
        log.info("---------------------" + onePost);
        if (!onePost.isEmpty()) {
            return ResponseEntity.ok(onePost);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("list not found ------- rno : " + rno);
        }
    }

    // 신청 취소
    @DeleteMapping("{ano}")
    public ResponseEntity<Object> cancelApplication(@PathVariable Long ano) {
        // 게시자 = 신청자일 경우 삭제 못 하도록 로직 추가 하기
        appliedService.cancelApplication(ano);
        return new ResponseEntity<>("application cancelled", HttpStatus.OK);
    }

}
