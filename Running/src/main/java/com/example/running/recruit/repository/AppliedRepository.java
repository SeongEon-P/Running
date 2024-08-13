package com.example.running.recruit.repository;

import com.example.running.recruit.domain.Applied;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppliedRepository extends JpaRepository<Applied, Long> {
    // 각 게시글의 현재 신청 인원 구하기
    @Query("select count(a) from Applied a Where a.recruitApply.rno = :rno")
    long countByRno(@Param("rno") long rno);
}
