package com.example.running.teamincruit.service;

import com.example.running.teamincruit.dto.TeamManageImgDTO;

import java.util.List;
import java.util.Optional;

public interface TeamManageImgService {

    void saveUploadedImages(String uuid, String teamName, String fileName, int order);

    Optional<TeamManageImgDTO> getFirstImageForTeam(String teamName);

    List<TeamManageImgDTO> getAllImagesForTeam(String teamName);

    void deleteImageByFileName(String fileName);
}
