package com.example.running.info.service;

import com.example.running.info.dto.InfoResourceDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface InfoResourceService {
    void saveAll(List<InfoResourceDTO> resourceDTOList);
    void deleteInfoResource(Long irno);
    int getMaxOrd(Long ino);
}
