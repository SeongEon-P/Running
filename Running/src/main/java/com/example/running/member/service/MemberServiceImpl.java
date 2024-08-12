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

    @Override
    public Optional<Member> findByMid(String mid) {
        return memberRepository.findByMid(mid);
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
