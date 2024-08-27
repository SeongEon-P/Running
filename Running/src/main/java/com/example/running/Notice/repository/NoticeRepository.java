package com.example.running.Notice.repository;

import com.example.running.Notice.domain.Notice;
import jdk.jfr.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findTop5ByOrderByRegDateDesc();
    // 중요한 공지사항만 조회하는 메서드
    List<Notice> findByImportantTrueOrderByRegDateDesc();

}
