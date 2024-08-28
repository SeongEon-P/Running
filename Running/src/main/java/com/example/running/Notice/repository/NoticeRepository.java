package com.example.running.Notice.repository;

import com.example.running.Notice.domain.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    @Query("SELECT COUNT(n) FROM Notice n WHERE n.regDate >= :threeDaysAgo")
    long countNoticesWithinThreeDays(@Param("threeDaysAgo") LocalDate threeDaysAgo);


    List<Notice> findTop5ByOrderByRegDateDesc();
}
