package com.example.running.recruit.service;


import com.example.running.member.domain.Member;
import com.example.running.member.repositroy.MemberRepository;
import com.example.running.recruit.domain.Recruit;
import com.example.running.recruit.dto.RecruitDTO;
import com.example.running.recruit.repository.RecruitRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
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
        Member member = memberRepository.findById(recruitDTO.getMid())
                .orElseThrow(() -> new IllegalArgumentException("Invalid member ID"));
        recruit.setMember(member);
        Recruit savedRecruit = recruitRepository.save(recruit);
        return modelMapper.map(savedRecruit, RecruitDTO.class);
    }

    @Override
    public List<Recruit> findAllRecruits() {
        return recruitRepository.findAll();
    }

    @Override
    public Optional<Recruit> findOneRecruit(Long rno) {
        return recruitRepository.findById(rno);
    }

    @Override
    public Recruit modifyRecruit(RecruitDTO recruitDTO) {
        log.info("수정할 게시글 번호 : " + recruitDTO.getRno());
        Optional<Recruit> result = recruitRepository.findById(recruitDTO.getRno());

        if (!result.isPresent()) {
            log.error("not found --------------- id : {}", recruitDTO.getRno());
            throw new NoSuchElementException("not found --------------- id : " + recruitDTO.getRno());
        }

        Recruit recruit = result.get();
        log.info("Recruit Found : {}" , recruit);

        recruit.changeRecruit(
                recruitDTO.getR_title(),
                recruitDTO.getR_content(),
                recruitDTO.getR_place(),
                recruitDTO.getR_place2(),
                recruitDTO.getR_date(),
                recruitDTO.getR_time(),
                recruitDTO.getMax_number()
        );

        Optional<Member> memberResult = memberRepository.findById(recruitDTO.getMid());
        if (!memberResult.isPresent()) {
            log.error("not found --------------- id : {}", recruitDTO.getMid());
            throw new NoSuchElementException("not found --------------- id : " + recruitDTO.getMid());
        }

        recruit.setMember(memberResult.get());

        Recruit modifyRecruit = recruitRepository.save(recruit);
        log.info("Recruit post is modified and saved ------- : {]", modifyRecruit);

        return modifyRecruit;
    }

    @Override
    public void deleteRecruit(Long rno) {
        recruitRepository.deleteById(rno);
    }

    @Override
    public List<Recruit> findPostByMid(String mid) {
        return List.of();
    }
}
