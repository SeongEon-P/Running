package com.example.running.teamincruit.service;

import com.example.running.teamincruit.domain.TeamRequest;
import com.example.running.teamincruit.dto.TeamRequestDTO;

import java.util.List;

public interface TeamRequestService {

    void createTeamRequest(TeamRequest teamRequest);

    List<TeamRequestDTO> getAllPendingRequests();

    void approveTeam(Long requestId);

    void rejectTeam(Long requestId);
}
