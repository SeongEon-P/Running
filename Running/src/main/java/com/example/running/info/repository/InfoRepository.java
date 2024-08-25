package com.example.running.info.repository;

import com.example.running.Review.domain.Review;
import com.example.running.info.domain.Info;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InfoRepository extends JpaRepository<Info, Long> {
    List<Info> findTop5ByOrderByRegDateDesc();
    List<Info> findByImportantTrueOrderByRegDateDesc();
}
