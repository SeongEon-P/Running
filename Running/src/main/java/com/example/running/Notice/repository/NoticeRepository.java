package com.example.running.Notice.repository;

import com.example.running.Notice.domain.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findTop5ByOrderByRegDateDesc();
}
