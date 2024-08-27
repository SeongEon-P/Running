package com.example.running.Notice.service;

import com.example.running.Notice.domain.Notice;
import com.example.running.Notice.dto.NoticeDTO;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public interface NoticeService {
    List<NoticeDTO> findAllNotice();
    NoticeDTO addNotice(NoticeDTO noticeDTO);
    NoticeDTO findOneNoticeById(Long nno);
    void deleteNotice(Long nno);
    Notice modifyNotice(NoticeDTO noticeDTO);
    List<NoticeDTO> findLatestNotices();
}
