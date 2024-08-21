package com.example.running.recruit.repository;

import com.example.running.recruit.domain.Recruit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecruitRepository extends JpaRepository<Recruit, Long> {
  Page<Recruit> findAll(Pageable pageable);
}
