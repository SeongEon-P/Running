package com.example.running.member.controller;

import com.example.running.member.domain.Member;
import com.example.running.member.dto.*;
import com.example.running.member.security.jwt.JwtTokenProvider;
import com.example.running.member.service.MemberService;
import com.example.running.member.utils.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/members")
@CrossOrigin(origins = "http://localhost:3000")
public class MemberController {

    @Autowired
    private MemberService memberService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private AuthenticationManager authenticationManager;


    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> createMember(@Valid @RequestBody Member member) {
        memberService.saveMember(member);
        return ResponseEntity.ok("Member created");
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Member member) {
        Optional<Member> existingMemberOpt = memberService.findByMid(member.getMid());

        if (!existingMemberOpt.isPresent()) {
            // 아이디가 존재하지 않는 경우 404 상태 코드 반환
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("등록된 아이디가 없습니다.");
        }

        Member existingMember = existingMemberOpt.get();

        // 디버깅: 로그 추가
        System.out.println("입력된 비밀번호: " + member.getMpw());
        System.out.println("저장된 비밀번호(암호화): " + existingMember.getMpw());

        // 올바른 비교 방법: matches() 메서드 사용
        boolean isPasswordMatch = passwordEncoder.matches(member.getMpw(), existingMember.getMpw());
        System.out.println("비밀번호 일치 여부: " + isPasswordMatch);


        // 비밀번호가 일치하지 않는 경우 로그 추가
        if (!passwordEncoder.matches(member.getMpw(), existingMember.getMpw())) {
            System.out.println("비밀번호가 일치하지 않음!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 틀렸습니다.");
        }

        // 사용자가 존재하고 비밀번호가 일치하면, 인증 객체 생성
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        member.getMid(),
                        member.getMpw()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // JWT 토큰 생성
        String jwt = jwtTokenProvider.createToken(existingMember.getMid(), existingMember.getRole().name());

        // JWT 토큰을 포함하여 응답 반환
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
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

        // 비밀번호 업데이트
        if (memberDTO.getNewPassword() != null && !memberDTO.getNewPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(memberDTO.getNewPassword());
            update.setMpw(encodedPassword); // 새 비밀번호 암호화 후 업데이트
        }

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

    // 로그아웃
    @ResponseBody
    @PostMapping("/logout")
    public ResponseEntity<Object> logout(HttpServletRequest request) {

        // 세선 삭제, 로컬에 저장중이기 때문에 필요없음
        // request.getSession().invalidate();

        // 실제로는 서버 측에서 세션을 무효화하거나, 클라이언트 측에서 토큰을 삭제
        // 여기서는 클라이언트에서 토큰을 삭제하는 것으로 충분함
        return ResponseEntity.ok().build();
    }

    // 회원정보
    @GetMapping("/me")
    @ResponseBody
    public ResponseEntity<MemberDTO> getCurrentMember(HttpServletRequest request) {
        String token = SecurityUtils.extractAuthTokenFromRequest(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = jwtTokenProvider.getAuthentication(request).getName();
        Member member = memberService.findByMid(username).orElseThrow(() -> new RuntimeException("User not found"));

        MemberDTO memberDTO = new MemberDTO();
        memberDTO.setMid(member.getMid());
        memberDTO.setEmail(member.getEmail());
        memberDTO.setName(member.getName());
        memberDTO.setPhone(member.getPhone());
        memberDTO.setAddress(member.getAddress());
        memberDTO.setRole(member.getRole());

        return ResponseEntity.ok(memberDTO);
    }

    // 회원탈퇴
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteMember(Authentication authentication) {
        String mid = authentication.getName();  // 현재 인증된 사용자의 ID 가져오기

        try {
            memberService.deleteMember(mid);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 탈퇴에 실패했습니다.");
        }
    }

    // 중복체크
    @GetMapping("/checked")
    public ResponseEntity<Boolean> checkDuplicate(
            @RequestParam String type,
            @RequestParam String value) {

        boolean isAvailable = memberService.isCheck(type, value);
        return ResponseEntity.ok(isAvailable);
    }

    // 아이디, 비밀번호 찾기
    @PostMapping("/find")
    public ResponseEntity<?> findMemberInfo(@RequestParam("type") String type, @RequestBody FindMemberRequest request) {
        try {
            if ("id".equalsIgnoreCase(type)) {
                String mid = memberService.findIdByEmail(request.getEmail());
                if (mid != null) {
                    return ResponseEntity.ok(new FindMemberResponse(mid));
                } else {
                    return ResponseEntity.status(404).body("아이디를 찾을 수 없습니다.");
                }
            } else if ("password".equalsIgnoreCase(type)) {
                boolean success = memberService.sendPasswordResetEmail(request.getEmail());
                if (success) {
                    return ResponseEntity.ok("비밀번호 재설정 링크가 전송되었습니다.");
                } else {
                    return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
                }
            } else {
                return ResponseEntity.badRequest().body("Invalid type parameter");
            }
        } catch (Exception e) {
            e.printStackTrace();  // 예외 스택 추적을 로그에 출력
            return ResponseEntity.status(500).body("서버 내부 오류가 발생했습니다.");
        }
    }

    // 비밀번호 재설정
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {

        System.out.println("Received token: " + request.getToken());
        System.out.println("Received newPassword: " + request.getNewPassword());

        boolean success = memberService.resetPassword(request.getToken(), request.getNewPassword());
        if (success) {
            return ResponseEntity.ok("비밀번호가 성공적으로 재설정되었습니다.");
        } else {
            return ResponseEntity.status(400).body("비밀번호 재설정에 실패했습니다.");
        }
    }

}
