package com.example.running.member.service;

import com.example.running.member.domain.Member;

import java.util.Optional;

public interface MemberService {
    Member saveMember(Member member);
    Optional<Member> findByMid(String mid);
    boolean authenticate(String mid, String password); // 사용자 인증

}
