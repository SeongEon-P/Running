package com.example.running.member.service;

import com.example.running.member.domain.Member;
import com.example.running.member.repositroy.MemberRepository;
import com.example.running.member.security.UserPrinciple;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String mid) throws UsernameNotFoundException {
        Member member = memberRepository.findByMid(mid)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with mid: " + mid));

        // 비밀번호 인코딩된 형태로 설정하지 않고 그대로 사용
        return UserPrinciple.builder()
                .mid(member.getMid())
                .mpw(member.getMpw()) // 비밀번호는 이미 인코딩된 상태로 저장되어 있음
                .member(member)
                .authorities(Collections.singleton(new SimpleGrantedAuthority("ROLE_" + member.getRole().name())))
                .build();
    }

    // 새로운 사용자 저장 시 비밀번호 인코딩
    public void saveUser(Member member) {
        member.setMpw(passwordEncoder.encode(member.getMpw()));
        memberRepository.save(member);
    }
}
