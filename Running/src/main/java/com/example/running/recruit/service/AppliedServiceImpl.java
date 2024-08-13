package com.example.running.recruit.service;

import com.example.running.member.domain.Member;
import com.example.running.member.repositroy.MemberRepository;
import com.example.running.recruit.domain.Applied;
import com.example.running.recruit.domain.Recruit;
import com.example.running.recruit.dto.AppliedDTO;
import com.example.running.recruit.repository.AppliedRepository;
import com.example.running.recruit.repository.RecruitRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class AppliedServiceImpl implements AppliedService {

    private final ModelMapper modelMapper;
    private final AppliedRepository appliedRepository;
    private final RecruitRepository recruitRepository;
    private final MemberRepository memberRepository;

    @Override
    public AppliedDTO applicate(AppliedDTO appliedDTO) {
        Applied applied = modelMapper.map(appliedDTO, Applied.class);
        Recruit recruit = recruitRepository.findById(appliedDTO.getRno())
                .orElseThrow(() -> new IllegalArgumentException("Invalid recruit no"));
        Member member = memberRepository.findById(appliedDTO.getMid())
                .orElseThrow(() -> new IllegalArgumentException("Invalid member id"));
        applied.setRecruit(recruit);
        applied.setMember(member);

        Applied saveApplication = appliedRepository.save(applied);
        return modelMapper.map(saveApplication, AppliedDTO.class);
    }

    // 신청 취소
    @Override
    public void cancelApplication(Long ano) {
        appliedRepository.deleteById(ano);
    }

    // 게시글 별로 신청한 사람 목록 보기
    @Override
    public List<Applied> getAppliedByRno(Long rno) {
        log.info("rno --------------------------- " + rno);
        return appliedRepository.findByRno(rno);
    }
}
