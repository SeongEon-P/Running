package com.example.running.member.service;

import com.example.running.member.domain.Member;
import com.example.running.member.domain.Role;

import java.util.Optional;

public interface MemberService {
    Member saveMember(Member member);
    Optional<Member> findByMid(String mid);
    void updateMember(Member member);

    // 이메일로 회원 조회 (선택 사항)
    Optional<Member> findByEmail(String email);

    boolean authenticate(String mid, String password); // 사용자 인증
    void deleteMember(String mid);

//    boolean isIdCheck(String mid);
    // 중복 검사 기능
    boolean isCheck(String type, String value);

    // 아이디, 비밀번호 찾기
    String findIdByEmail(String email);
    boolean sendPasswordResetEmail(String email);
    boolean resetPassword(String token, String newPassword);

    //롤 업데이트
    void updateRole(String mid, Role newRole);

}
