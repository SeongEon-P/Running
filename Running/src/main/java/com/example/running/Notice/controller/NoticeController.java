package com.example.running.Notice.controller;

import com.example.running.Notice.dto.NoticeDTO;
import com.example.running.Notice.dto.NoticeResourceDTO;
import com.example.running.Notice.service.NoticeResourceService;
import com.example.running.Notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
@CrossOrigin("http://localhost:3000")
@Log4j2
public class NoticeController {
    private final NoticeService noticeService;
    private final NoticeResourceService noticeResourceService;
    private final Path fileSotirageLocation = Paths.get("file-storage").toAbsolutePath().normalize();
    private NoticeDTO noticeDTO;

    @GetMapping("/list")
    public List<NoticeDTO> getNoticeList(){
        return noticeService.findAllNotice();
    }
    @PostMapping(value = "/register", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Object> registerNotice(NoticeDTO noticeDTO){
        List<NoticeResourceDTO> resourceDTOList = new ArrayList<NoticeResourceDTO>();
        NoticeDTO savedNotice = noticeService.addNotice(noticeDTO);
        if(noticeDTO.getFiles() != null){
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
                resourceDTOList.add(dto);
                ord++;
            }
            noticeResourceService.saveAll(resourceDTOList);
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
}
