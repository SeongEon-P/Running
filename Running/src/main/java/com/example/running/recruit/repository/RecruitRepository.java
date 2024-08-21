package com.example.running.recruit.repository;

import com.example.running.recruit.domain.Recruit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecruitRepository extends JpaRepository<Recruit, Long> {
}
