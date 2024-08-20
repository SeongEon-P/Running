package com.example.running.member.repositroy;

import com.example.running.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


public interface MemberRepository extends JpaRepository<Member, String> {
    Optional<Member> findByMid(String mid); // 이 부분 추가
    Optional<Member> findByEmail(String email);

    boolean existsByMid(String mid);   // 아이디 중복 체크
    boolean existsByEmail(String email);  // 이메일 중복 체크
    boolean existsByPhone(String phone);  // 전화번호 중복 체크

    Optional<Member> findByResetToken(String resetToken);

    // 카카오
    Optional<Member> findByKakaoId(String kakaoId);
}
