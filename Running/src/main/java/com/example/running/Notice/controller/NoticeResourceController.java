package com.example.running.Notice.controller;

import com.example.running.Notice.dto.NoticeResourceDTO;
import com.example.running.Notice.service.NoticeResourceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notice/files")
@Log4j2
public class NoticeResourceController {
    private final NoticeResourceService noticeResourceService;
    private final Path fileStorageLocation = Paths.get("C:/upload").toAbsolutePath().normalize();

    // 파일 저장 시 디렉토리가 존재하지 않으면 생성
    private void createDirectoryIfNotExists() {
        File directory = fileStorageLocation.toFile();
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (!created) {
                throw new RuntimeException("Could not create directory: " + fileStorageLocation.toString());
            }
        }
    }

    @DeleteMapping("{nrno}")
    public ResponseEntity<Object> deleteFile(@PathVariable long nrno) {
        noticeResourceService.deleteNoticeResource(nrno);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("{nno}")
    public ResponseEntity<Object> createNotice(@PathVariable("nno") Long nno, @RequestParam("files") List<MultipartFile> files) {
        createDirectoryIfNotExists(); // 디렉토리 생성 확인

        List<NoticeResourceDTO> resourceDtoList = new ArrayList<>();
        if (files != null) {
            int ord = noticeResourceService.getMaxOrd(nno);
            for (MultipartFile file : files) {
                Path targetLocation = fileStorageLocation.resolve(file.getOriginalFilename());
                try {
                    Files.copy(file.getInputStream(), targetLocation); // 파일 저장
                    NoticeResourceDTO dto = NoticeResourceDTO.builder()
                            .nr_name(file.getOriginalFilename())
                            .nr_ord(ord)
                            .nr_type(file.getContentType())
                            .nno(nno)
                            .build();
                    resourceDtoList.add(dto);
                    ord++;
                } catch (IOException e) {
                    log.error("Failed to store file " + file.getOriginalFilename(), e);
                    return new ResponseEntity<>("Failed to store file: " + file.getOriginalFilename(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            noticeResourceService.saveAll(resourceDtoList);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = fileStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new FileNotFoundException("Could not find or read the file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: Malformed URL " + e.getMessage());
        } catch (FileNotFoundException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}