package com.example.running.member.service;

import com.example.running.member.domain.Member;
import com.example.running.member.repositroy.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // 회원가입
    @Override
    public Member saveMember(Member member) {

        // 중복된 아이디가 있는지 확인
        if (memberRepository.findByMid(member.getMid()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }

        try {
            member.setMpw(passwordEncoder.encode(member.getMpw())); // 비밀번호 암호화
            return memberRepository.save(member);
        } catch (Exception e) {
            e.printStackTrace();  // 예외를 콘솔에 출력
            throw new RuntimeException("회원가입 중 오류가 발생했습니다.", e);  // 예외를 다시 던짐
        }
    }

    // 로그인
    @Override
    public Optional<Member> findByMid(String mid) {
        return memberRepository.findByMid(mid);
    }

    // 회원정보 수정
    @Override
    public void updateMember(Member member) {
        Optional<Member> members = memberRepository.findById(member.getMid());

        if (members.isPresent()) {
            Member updateMember = members.get();

            // 비밀번호가 존재하고 수정되었으면 암호화 처리 후 저장
            if (member.getMpw() != null && !member.getMpw().isEmpty()) {
                String encodedPassword = passwordEncoder.encode(member.getMpw()); // 비밀번호 암호화
                updateMember.setMpw(encodedPassword);
            }

            // 나머지 정보 업데이트
            updateMember.setName(member.getName());
            updateMember.setEmail(member.getEmail());
            updateMember.setPhone(member.getPhone());
            updateMember.setAddress(member.getAddress());
            updateMember.setRole(member.getRole());

            memberRepository.save(updateMember);
        } else {
            throw new IllegalArgumentException("해당 ID를 가진 회원을 찾을 수 없습니다.");
        }
    }


    // 이메일로 회원찾기
    @Override
    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    @Override
    public boolean authenticate(String mid, String rawPassword) {
        Optional<Member> optionalMember = findByMid(mid);

        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();
            if (passwordEncoder.matches(rawPassword, member.getMpw())) {
                return true;
            }
        }
        return false;
    }

    // 회원탈퇴
    @Override
    public void deleteMember(String mid) {
        // 회원이 존재하는지 확인
        Member member = memberRepository.findByMid(mid)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다."));

        // 회원 정보 삭제
        memberRepository.delete(member);
    }

    // 회원 정보 확인
    @Override
    public boolean isCheck(String type, String value) {
        switch (type.toLowerCase()) {
            case "id":
                return !memberRepository.existsByMid(value);
            case "email":
                return !memberRepository.existsByEmail(value);
            case "phone":
                return !memberRepository.existsByPhone(value);
            default:
                throw new IllegalArgumentException("Invalid type: " + type);
        }
    }

    // 메일로 아이디 찾기
    @Override
    public String findIdByEmail(String email) {
        Optional<Member> member = memberRepository.findByEmail(email);
        return (member.isPresent()) ? member.get().getMid() : null;
    }

    // 메일주소로 인증코드 보내기
    @Override
    public boolean sendPasswordResetEmail(String email) {
        try {
            Optional<Member> memberOpt = memberRepository.findByEmail(email);
            if (memberOpt.isPresent()) {
                String resetToken = generateResetToken();
                Member member = memberOpt.get();
                member.setResetToken(resetToken);
                memberRepository.save(member); // 저장을 시도합니다.
                emailService.sendPasswordResetEmail(email, resetToken); // 이메일 전송
                return true;
            } else {
                System.out.println("사용자를 찾을 수 없습니다.");
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    // 비밀번호 재설정
    @Override
    public boolean resetPassword(String token, String newPassword) {
        try {
            // 토큰을 사용하여 해당 사용자를 찾음
            Optional<Member> memberOpt = memberRepository.findByResetToken(token);
            if (memberOpt.isPresent()) {
                Member member = memberOpt.get();

                // 비밀번호 암호화 후 설정
                member.setMpw(passwordEncoder.encode(newPassword)); // 비밀번호 암호화

                // 토큰을 무효화하여 재사용 방지
                member.setResetToken(null);

                // 변경된 정보를 데이터베이스에 저장
                memberRepository.save(member);
                return true;
            } else {
                return false; // 사용자가 존재하지 않거나 토큰이 유효하지 않은 경우
            }
        } catch (Exception e) {
            e.printStackTrace(); // 로그에 예외 출력
            throw new RuntimeException("비밀번호 재설정 중 오류가 발생했습니다.", e);
        }
    }


    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }

}
