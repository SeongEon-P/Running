package com.example.running.member.controller;

import com.example.running.member.domain.Member;
import com.example.running.member.domain.Role;
import com.example.running.member.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/members")
@CrossOrigin(origins = "http://localhost:3000")
public class MemberController {

    @Autowired
    private MemberService memberService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> createMember(@Valid @RequestBody Member member) {
        memberService.saveMember(member);
        return ResponseEntity.ok("Member created");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Member member) {
        // Optional에서 Member 객체를 추출
        Member mid = memberService.findByMid(member.getMid()).orElse(null);

        if (mid != null && passwordEncoder.matches(member.getMpw(), mid.getMpw())) {
            return ResponseEntity.ok("로그인 성공");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: 잘못된 아이디 또는 비밀번호");
        }
    }


}
