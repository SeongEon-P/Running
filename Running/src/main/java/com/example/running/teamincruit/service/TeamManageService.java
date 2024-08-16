package com.example.running.teamincruit.service;


import com.example.running.teamincruit.dto.TeamManageDTO;

import java.util.List;

public interface TeamManageService {

    String registerTeam(TeamManageDTO teamManageDTO);

    TeamManageDTO getTeam(String teamName);

    void modifyTeam(TeamManageDTO teamManageDTO);

    void removeTeam(Long tno);

    List<TeamManageDTO> getAllTeam();
}
