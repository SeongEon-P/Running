package com.example.running.Notice.service;

import com.example.running.Notice.dto.NoticeResourceDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class NoticeResourceServiceImpl implements NoticeResourceService{
    @Override
    public void saveAll(List<NoticeResourceDTO> resourceDTOList) {

    }
}
