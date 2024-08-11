package com.example.running.teamincruit.service;


import com.example.running.teamincruit.dto.TeamManageDTO;

import java.util.List;

public interface TeamMangeService {

    String registerTeam(TeamManageDTO teamManageDTO);

    TeamManageDTO getTeam(String team_name);

    void modifyTeam(TeamManageDTO teamManageDTO);

    void removeTeam(String team_name);

    List<TeamManageDTO> getAllTeam();
}
