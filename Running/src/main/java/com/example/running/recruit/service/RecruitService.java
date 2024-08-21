package com.example.running.recruit.service;

import com.example.running.recruit.domain.Recruit;
import com.example.running.recruit.dto.RecruitDTO;

import java.util.List;
import java.util.Optional;

public interface RecruitService {

    // 게시글 등록
    RecruitDTO registerRecruit(RecruitDTO recruitDTO);

    // 게시글 목록 조회
    List<Recruit> findAllRecruits();

    // 한 개의 게시글 조회
    Optional<Recruit> findOneRecruit(Long rno);

    // 게시글 수정
    Recruit modifyRecruit(RecruitDTO recruitDTO);

    // 게시글 삭제
    void deleteRecruit(Long rno);

    List<Recruit> findPostByMid(String mid);

    // 검색
    List<Recruit> searchRecruits(String keyword);
}
