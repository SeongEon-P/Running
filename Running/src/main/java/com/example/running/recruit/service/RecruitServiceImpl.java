package com.example.running.recruit.service;

import com.example.running.member.Repository.MemberRepository;
import com.example.running.member.domain.Member;
import com.example.running.recruit.domain.Recruit;
import com.example.running.recruit.dto.RecruitDTO;
import com.example.running.recruit.repository.RecruitRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class RecruitServiceImpl implements RecruitService {

    private final ModelMapper modelMapper;
    private final RecruitRepository recruitRepository;
    private final MemberRepository memberRepository;

    // 게시글 등록
    @Override
    public RecruitDTO registerRecruit(RecruitDTO recruitDTO) {
        Recruit recruit = modelMapper.map(recruitDTO, Recruit.class);
        Member member = memberRepository.findById(recruitDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid member ID"));
        recruit.setMember(member);
        Recruit savedRecruit = recruitRepository.save(recruit);
        return modelMapper.map(savedRecruit, RecruitDTO.class);
    }

    @Override
    public List<Recruit> getAllRecruits() {
        return List.of();
    }

    @Override
    public Optional<Recruit> findOneRecruit(Long rno) {
        return Optional.empty();
    }

    @Override
    public Recruit modifyRecruit(RecruitDTO recruitDTO) {
        return null;
    }

    @Override
    public void deleteRecruit(Long rno) {

    }

    @Override
    public List<Recruit> findPostByMid(String mid) {
        return List.of();
    }
}
