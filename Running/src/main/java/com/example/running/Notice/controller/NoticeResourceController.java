package com.example.running.Notice.controller;

import com.example.running.Notice.dto.NoticeResourceDTO;
import com.example.running.Notice.service.NoticeResourceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notice")
@Log4j2
public class NoticeResourceController {
    private final NoticeResourceService noticeResourceService;
    private final Path fileStorageLocation = Paths.get("file-storage").toAbsolutePath().normalize();

    @DeleteMapping("{nrno}")
    public ResponseEntity<Object> deleteFile(@PathVariable long nrno) {
        noticeResourceService.deleteNoticeResource(nrno);
        return new ResponseEntity<>(HttpStatus.OK);

    }
    @PostMapping("{nno}")
    public ResponseEntity<Object> createNotice(@PathVariable("nno") Long nno,List<MultipartFile> files) {
        List<NoticeResourceDTO> resourceDtoList = new ArrayList<NoticeResourceDTO>();
        if (files != null) {
            int ord = noticeResourceService.getMaxOrd(nno);
            for (MultipartFile file : files) {
                Path savePath = Paths.get("C:\\upload", file.getOriginalFilename());
                try {
                    file.transferTo(savePath);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                NoticeResourceDTO dto = NoticeResourceDTO.builder()
                        .nr_name(file.getOriginalFilename())
                        .nr_ord(ord)
                        .nr_type(file.getContentType())
                        .nno(nno)
                        .build();
                resourceDtoList.add(dto);
                ord++;
            }
            noticeResourceService.saveAll(resourceDtoList);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
