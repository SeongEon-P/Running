package com.example.running.Review.controller;

import com.example.running.Review.dto.ReviewResourceDTO;
import com.example.running.Review.service.ReviewResourceService;
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
@RequestMapping("/review/files")
@Log4j2
public class ReviewResourceController {
    private final ReviewResourceService reviewResourceService;
    private final Path fileStorageLocation = Paths.get("file-storage").toAbsolutePath().normalize();

    @DeleteMapping("{rrno}")
    public ResponseEntity<Object> deleteFile(@PathVariable long rrno) {
        reviewResourceService.deleteReview(rrno);
        return new ResponseEntity<>(HttpStatus.OK);

    }
    @PostMapping("{rno}")
    public ResponseEntity<Object> createReview(@PathVariable("rno") Long rno, List<MultipartFile> files) {
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
}
