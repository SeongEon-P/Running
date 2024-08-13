package com.example.running.recruit.repository;

import com.example.running.recruit.domain.Applied;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AppliedRepository extends JpaRepository<Applied, Long> {
    // 각 게시글의 현재 신청 인원 구하기
    @Query("select count(a) from Applied a Where a.recruitApply.rno = :rno")
    Long countByRno(@Param("rno") Long rno);

    // rno 별로 목록 구하기
    @Query("Select a from Applied a where a.recruitApply.rno = :rno")
    List<Applied> findByRno(@Param("rno") Long rno);

}
