package com.example.running.info.service;

import com.example.running.info.domain.Info;
import com.example.running.info.dto.InfoDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface InfoService {
    List<InfoDTO> findAllInfo();
    InfoDTO addInfo(InfoDTO infoDTO);
    InfoDTO findOneInfoById(Long ino);
    void deleteInfo(Long ino);
    Info modifyInfo(InfoDTO infoDTO);
    List<InfoDTO> findLatestInfo();
}
