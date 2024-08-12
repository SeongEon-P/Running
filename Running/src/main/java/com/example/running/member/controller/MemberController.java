package com.example.running.member.controller;

import com.example.running.member.domain.Member;
import com.example.running.member.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/members")
@CrossOrigin(origins = "http://localhost:3000")
public class MemberController {

    @Autowired
    private MemberService memberService;

//    @GetMapping("/signup")
//    public ResponseEntity<String> signup() {
//        return ResponseEntity.ok("React에서 처리");
//    }

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> createMember(@Valid @RequestBody Member member) {
        memberService.saveMember(member);
        return ResponseEntity.ok("Member created");
    }
}
