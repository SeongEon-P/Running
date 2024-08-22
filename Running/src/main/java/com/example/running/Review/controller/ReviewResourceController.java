package com.example.running.Review.controller;

import com.example.running.Review.dto.ReviewResourceDTO;
import com.example.running.Review.service.ReviewResourceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/review/files")
@Log4j2
public class ReviewResourceController {
    private final ReviewResourceService reviewResourceService;
    private final Path fileStorageLocation = Paths.get("C:\\upload").toAbsolutePath().normalize();

    @DeleteMapping("{rrno}")
    public ResponseEntity<Object> deleteFile(@PathVariable long rrno) {
        reviewResourceService.deleteReview(rrno);
        return new ResponseEntity<>(HttpStatus.OK);

    }
    @PostMapping("{rno}")
    public ResponseEntity<Object> createReview(@PathVariable("rno") Long rno, @RequestParam("files")List<MultipartFile> files) {
        List<ReviewResourceDTO> resourceDtoList = new ArrayList<ReviewResourceDTO>();
        if (files != null) {
            int ord = reviewResourceService.getMaxOrd(rno);
            for (MultipartFile file : files) {
                Path savePath = Paths.get("C:\\upload", file.getOriginalFilename());
                try {
                    file.transferTo(savePath);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                ReviewResourceDTO dto = ReviewResourceDTO.builder()
                        .rr_name(file.getOriginalFilename())
                        .rr_ord(ord)
                        .rr_type(file.getContentType())
                        .rno(rno)
                        .build();
                resourceDtoList.add(dto);
                ord++;
            }
            reviewResourceService.saveReview(resourceDtoList);
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