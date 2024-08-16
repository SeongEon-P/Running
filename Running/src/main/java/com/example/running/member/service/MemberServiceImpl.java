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

    // 회원탈퇴
    @Override
    public void deleteMember(String mid) {
        // 회원이 존재하는지 확인
        Member member = memberRepository.findByMid(mid)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다."));

        // 회원 정보 삭제
        memberRepository.delete(member);
    }

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


    // id 중복체크
//    @Override
//    public boolean isIdCheck(String mid) {
//        return !memberRepository.findByMid(mid).isPresent();
//    }
}
