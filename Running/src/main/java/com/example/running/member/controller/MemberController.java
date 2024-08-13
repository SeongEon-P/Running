package com.example.running.member.controller;

import com.example.running.member.domain.Member;
import com.example.running.member.domain.Role;
import com.example.running.member.dto.MemberDTO;
import com.example.running.member.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    // 로그인
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

    // 회원정보 수정
    // 회원 정보 수정 시 민감한 데이터(예: 비밀번호)를 포함하지 않는 MemberDTO를 사용해 안전하게 데이터를 처리
    @PostMapping("/update")
    public ResponseEntity<String> update(@RequestBody MemberDTO memberDTO) {

        Member update = memberService.findByMid(memberDTO.getMid()).orElse(null);

        if (update == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원 정보를 찾을 수 없습니다.");
        }

        // 정보 업데이트
        update.setName(memberDTO.getName());
        update.setEmail(memberDTO.getEmail());
        update.setPhone(memberDTO.getPhone());
        update.setAddress(memberDTO.getAddress());
        update.setRole(memberDTO.getRole());

        memberService.updateMember(update);

        return ResponseEntity.ok("회원 정보가 성공적으로 업데이트되었습니다.");
    }

    // 비밀번호 확인
    @PostMapping("/check-password")
    public ResponseEntity<String> checkPassword(@RequestBody Map<String, String> check) {
        String mid = check.get("mid");
        String password = check.get("password");

        Member member = memberService.findByMid(mid).orElse(null);

        if (member != null && passwordEncoder.matches(password, member.getMpw())) {
            return ResponseEntity.ok("비밀번호 확인 성공");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }
    }

}
