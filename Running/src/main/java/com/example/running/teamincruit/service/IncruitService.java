package com.example.running.teamincruit.service;

import com.example.running.teamincruit.dto.IncruitDTO;

import java.util.List;

public interface IncruitService {

    Long registerIncruit(IncruitDTO incruitDTO);

    IncruitDTO getIncruit(Long ino);

    void modifyIncruit(IncruitDTO incruitDTO);

    void removeIncruit(Long ino);

    List<IncruitDTO> getAllIncruit();


}
