package com.example.running.member.controller;

import com.example.running.member.domain.Member;
import com.example.running.member.domain.Role;
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
        System.out.println("회원가입 요청 처리 시작");  // 로그 추가
        memberService.saveMember(member);
        System.out.println("회원가입 요청 처리 완료");  // 로그 추가
        return ResponseEntity.ok("Member created");
    }

//    @PostMapping("/signup")
//    public ResponseEntity<String> createMember(@Valid @RequestBody Member member) {
//        // 기본 역할을 USER로 설정하는 예
//        if (member.getRole() == null) {
//            member.setRole(Role.USER);
//        }
//        memberService.saveMember(member);
//        return ResponseEntity.ok("Member created");
//    }

}
