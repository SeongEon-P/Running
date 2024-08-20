package com.example.running.Notice.controller;

import com.example.running.Notice.domain.Notice;
import com.example.running.Notice.dto.NoticeDTO;
import com.example.running.Notice.dto.NoticeResourceDTO;
import com.example.running.Notice.service.NoticeResourceService;
import com.example.running.Notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notice")
@CrossOrigin("http://localhost:3000")
@Log4j2
public class NoticeController {
    private final NoticeService noticeService;
    private final NoticeResourceService noticeResourceService;
    private final Path fileStorageLocation = Paths.get("file-storage").toAbsolutePath().normalize();
    private NoticeDTO noticeDTO;

    @GetMapping("/list")
    public List<NoticeDTO> getNoticeList(){
        return noticeService.findAllNotice();
    }

    @PostMapping(value = "/register", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Object> addNotice(NoticeDTO noticeDTO){
        List<NoticeResourceDTO> resourceDtoList = new ArrayList<NoticeResourceDTO>();
        NoticeDTO savedNotice = noticeService.addNotice(noticeDTO);
        if (noticeDTO.getFiles() != null) {
            int ord = 0;
            for (MultipartFile file : noticeDTO.getFiles()) {
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
                        .nno(savedNotice.getNno())
                        .build();
                resourceDtoList.add(dto);
                ord++;
            }
            noticeResourceService.saveAll(resourceDtoList);
        }

        return new ResponseEntity<>(savedNotice, HttpStatus.CREATED);
    }

    @GetMapping("/read")
    public ResponseEntity<Object> getReadNotice(@RequestParam Long nno){
        NoticeDTO oneNotice  = noticeService.findOneNoticeById(nno);
        if(oneNotice != null && oneNotice.getNno() != null){
            return new ResponseEntity<>(oneNotice, HttpStatus.OK);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notice not found with id " + nno);
        }

    }
    @DeleteMapping("/{nno}")
    public ResponseEntity<Object> deleteNotice(@PathVariable Long nno){
        noticeService.deleteNotice(nno);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @PutMapping("/{nno}")
    public ResponseEntity<Object> modifyNotice(@ModelAttribute NoticeDTO noticeDTO){
        try {
            int ord = 0;
            List<NoticeResourceDTO> resourceDTOList = new ArrayList<>();

            if (noticeDTO.getFiles() != null) {
                for (MultipartFile file : noticeDTO.getFiles()) {
                    Path savePath = Paths.get("C:\\upload", file.getOriginalFilename());
                    try {
                        file.transferTo(savePath);
                    } catch (IOException e) {
                        log.error("File upload error for file: " + file.getOriginalFilename(), e);
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }

                    NoticeResourceDTO dto = NoticeResourceDTO.builder()
                            .nr_name(file.getOriginalFilename())
                            .nr_ord(ord)
                            .nr_type(file.getContentType())
                            .nno(noticeDTO.getNno())
                            .build();
                    resourceDTOList.add(dto);
                    ord++;
                }

                noticeResourceService.deleteNoticeResource(noticeDTO.getNno());
                noticeResourceService.saveAll(resourceDTOList);
            }

            Notice modifiedNotice = noticeService.modifyNotice(noticeDTO);
            return new ResponseEntity<>(modifiedNotice, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            log.error("Notice not found with ID: " + noticeDTO.getNno(), e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            log.error("Unexpected error during notice modification", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
