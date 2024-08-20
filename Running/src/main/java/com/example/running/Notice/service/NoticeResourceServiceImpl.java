package com.example.running.Notice.service;

import com.example.running.Notice.domain.NoticeResource;
import com.example.running.Notice.dto.NoticeResourceDTO;
import com.example.running.Notice.repository.NoticeRepository;
import com.example.running.Notice.repository.NoticeResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class NoticeResourceServiceImpl implements NoticeResourceService{
    private final NoticeResourceRepository noticeResourceRepository;
    private final ModelMapper modelMapper;
    private final NoticeRepository noticeRepository;

    @Override
    public void saveAll(List<NoticeResourceDTO> resourceDTOList) {
        List<NoticeResource> ResourceList =
                resourceDTOList.stream().map(dto -> modelMapper.map(dto, NoticeResource.class)
                ).collect(Collectors.toList());
        noticeResourceRepository.saveAll(ResourceList);
    }

    @Override
    public void deleteNoticeResource(Long nrno) {
        noticeRepository.deleteById(nrno);
    }

    @Override
    public int getMaxOrd(Long nno) {
        return noticeResourceRepository.getMaxOrd(nno);
    }
}
