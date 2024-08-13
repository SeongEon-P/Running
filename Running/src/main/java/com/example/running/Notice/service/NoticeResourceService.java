package com.example.running.Notice.service;

import com.example.running.Notice.dto.NoticeResourceDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface NoticeResourceService {
    void saveAll(List<NoticeResourceDTO> resourceDTOList);
    void deleteNoticeResource(Long nrno);
    int getMaxOrd(Long nno);
}
