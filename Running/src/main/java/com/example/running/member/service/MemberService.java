package com.example.running.member.service;

import com.example.running.member.domain.Member;

import java.util.Optional;

public interface MemberService {
    Member saveMember(Member member);
    Optional<Member> findByMid(String mid);
    void updateMember(Member member);

    // 이메일로 회원 조회 (선택 사항)
    Optional<Member> findByEmail(String email);

    boolean authenticate(String mid, String password); // 사용자 인증
    void deleteMember(String mid);
}
