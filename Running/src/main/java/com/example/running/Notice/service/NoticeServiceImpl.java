package com.example.running.Notice.service;

import com.example.running.Notice.domain.Notice;
import com.example.running.Notice.domain.NoticeResource;
import com.example.running.Notice.dto.NoticeDTO;
import com.example.running.Notice.dto.NoticeResourceDTO;
import com.example.running.Notice.repository.NoticeRepository;
import com.example.running.Notice.repository.NoticeResourceRepository;
import com.example.running.member.domain.Member;
import com.example.running.member.dto.MemberDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class NoticeServiceImpl implements NoticeService {
    private final NoticeRepository noticeRepository;
    private final NoticeResourceService noticeResourceService;
    private final ModelMapper modelMapper;
    private final NoticeResourceRepository noticeResourceRepository;

    @Override
    public List<NoticeDTO> findAllNotice() {
        List<Notice> notices = noticeRepository.findAll();
        List<NoticeDTO> noticeDTOList = notices.stream().map(notice -> modelMapper.map(notice, NoticeDTO.class)).collect(Collectors.toList());
        return noticeDTOList;
    }

    @Override
    public NoticeDTO addNotice(NoticeDTO noticeDTO){
        Notice notice = Notice.builder()
                .n_title(noticeDTO.getN_title())
                .n_content(noticeDTO.getN_content())
                .n_image(noticeDTO.getN_image())
                .writer(noticeDTO.getWriter())
                .build();
        Notice savedNotice = noticeRepository.save(notice);
        return modelMapper.map(savedNotice, NoticeDTO.class);
    }

    @Override
    public NoticeDTO findOneNoticeById(Long nno) {
        Optional<Notice> result=noticeRepository.findById(nno);
        Notice notice = result.orElseThrow();
        Set<NoticeResource> nrList = notice.getNoticeResourceSet();
        List<NoticeResourceDTO> nrDtoList = new ArrayList<>();
        for(NoticeResource noticeResource : nrList) {
            nrDtoList.add(NoticeResourceDTO.builder()
                    .nrno(noticeResource.getNrno())
                    .file_size(noticeResource.getFile_size())
                    .nr_name(noticeResource.getNr_name())
                    .nr_ord(noticeResource.getNr_ord())
                    .nr_path(noticeResource.getNr_path())
                    .nr_type(noticeResource.getNr_type())
                    .nno(noticeResource.getNotice().getNno())
                    .build());
        }
        NoticeDTO noticeListDTO = NoticeDTO.builder()
                .nno(notice.getNno())
                .n_title(notice.getN_title())
                .n_content(notice.getN_content())
                .n_image(notice.getN_image())
                .writer(notice.getWriter())
                .regDate(notice.getRegDate())
                .notice_resource(nrDtoList)
                .build();
        return noticeListDTO;
    }

    @Override
    public void deleteNotice(Long nno) {
        noticeRepository.deleteById(nno);
        noticeResourceRepository.deleteById(nno);
    }

    @Override
    public Notice modifyNotice(NoticeDTO noticeDTO) {
        Optional<Notice> result = noticeRepository.findById(noticeDTO.getNno());
        if(!result.isPresent()){
            throw new NoSuchElementException("Notice Not Found with ID: " + noticeDTO.getNno());
        }
        Notice notice = result.get();
        notice.changeNotice(
                noticeDTO.getN_title(),
                noticeDTO.getN_content(),
                noticeDTO.getN_image(),
                Member.builder().mid(noticeDTO.getWriter()).build()
        );
        Notice savedNotice = noticeRepository.save(notice);
        return savedNotice;
    }

    @Override
    public List<NoticeDTO> findLatestNotices() {
        List<Notice> notices = noticeRepository.findTop5ByOrderByRegDateDesc();
        return notices.stream()
                .map(notice -> modelMapper.map(notice, NoticeDTO.class))
                .collect(Collectors.toList());
    }
}
