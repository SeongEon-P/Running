package com.example.running.teamincruit.repository;

import com.example.running.teamincruit.domain.TeamMemberRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamMemberRequestRepository extends JpaRepository<TeamMemberRequest, Long> {
}
