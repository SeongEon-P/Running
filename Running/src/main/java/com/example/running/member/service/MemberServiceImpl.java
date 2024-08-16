package com.example.running.member.service;

import com.example.running.member.domain.Member;
import com.example.running.member.repositroy.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    @Autowired
    private final MemberRepository memberRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    // 회원가입
    @Override
    public Member saveMember(Member member) {
        try {
            member.setMpw(passwordEncoder.encode(member.getMpw()));
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
            if (!member.getMpw().isEmpty()) {
                updateMember.setMpw(member.getMpw());
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


}
