package com.example.running.Notice.repository;

import com.example.running.Notice.domain.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    @Query("SELECT COUNT(n) FROM Notice n WHERE n.regDate > CURRENT_DATE - 3")
    long countNoticesWithinThreeDays();

    List<Notice> findTop5ByOrderByRegDateDesc();
}
