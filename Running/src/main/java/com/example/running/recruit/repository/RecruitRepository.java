package com.example.running.recruit.repository;

import com.example.running.recruit.domain.Recruit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecruitRepository extends JpaRepository<Recruit, Long> {
    @Query("SELECT r FROM Recruit r WHERE " +
            "LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.memberRecruit.mid) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Recruit> searchRecruitsByKeyword(@Param("keyword") String keyword);
}
