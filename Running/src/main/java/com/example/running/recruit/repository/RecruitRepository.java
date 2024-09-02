package com.example.running.recruit.repository;

import com.example.running.recruit.domain.Recruit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface RecruitRepository extends JpaRepository<Recruit, Long> {
//    @Query("SELECT r FROM Recruit r WHERE " +
//            "(LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
//            "LOWER(r.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
//            "LOWER(r.memberRecruit.mid) LIKE LOWER(CONCAT('%', :keyword, '%'))) and " +
//            "(r.date between :startDate and :endDate) and " +
//            "(r.time between :startTime and :endTime) ")
//    List<Recruit> searchRecruitsByKeywordAndDateTime(
//            @Param("keyword") String keyword,
//            @Param("startDate") LocalDate startDate,
//            @Param("endDate") LocalDate endDate,
//            @Param("startTime") LocalTime startTime,
//            @Param("endTime") LocalTime endTime);
@Query("SELECT r FROM Recruit r WHERE " +
        "(LOWER(r.title) LIKE :keywordPattern OR " +
        "LOWER(r.content) LIKE :keywordPattern OR " +
        "LOWER(r.memberRecruit.mid) LIKE :keywordPattern) and " +
        "(r.date between :startDate and :endDate) and " +
        "(r.time between :startTime and :endTime) ")
List<Recruit> searchRecruitsByKeywordAndDateTime(
        @Param("keywordPattern") String keywordPattern,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime);

}
