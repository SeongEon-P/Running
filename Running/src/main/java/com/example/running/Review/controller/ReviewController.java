package com.example.running.Review.controller;

import com.example.running.Notice.dto.NoticeDTO;
import com.example.running.Notice.dto.NoticeResourceDTO;
import com.example.running.Review.domain.Review;
import com.example.running.Review.dto.ReviewDTO;
import com.example.running.Review.dto.ReviewResourceDTO;
import com.example.running.Review.service.ReviewResourceService;
import com.example.running.Review.service.ReviewService;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/review")
@CrossOrigin("http://localhost:3000")
@Log4j2
public class ReviewController {
    private final ReviewService reviewService;
    private final ReviewResourceService reviewResourceService;
    private final Path fileStorageLocation = Paths.get("file-storage").toAbsolutePath().normalize();

    @GetMapping("/list")
    public List<ReviewDTO> getReviewList(){
        return reviewService.findAllReview();
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReviewDTO> addReview(
            @RequestParam("r_title") String rTitle,
            @RequestParam("r_content") String rContent,
            @RequestParam("writer") String writer,
            @RequestParam("is_important") boolean isImportant,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setR_title(rTitle);
        reviewDTO.setR_content(rContent);
        reviewDTO.setWriter(writer);
        reviewDTO.setImportant(isImportant);

        ReviewDTO savedReview = reviewService.addReview(reviewDTO);

        if (files != null) {
            List<ReviewResourceDTO> resourceDtoList = new ArrayList<>();
            int ord = 0;
            for (MultipartFile file : files) {
                Path savePath = Paths.get("C:\\upload",file.getOriginalFilename());
                try {
                    file.transferTo(savePath.toFile());
                    ReviewResourceDTO dto = ReviewResourceDTO.builder()
                            .rr_name(file.getOriginalFilename())
                            .rr_ord(ord++)
                            .rr_type(file.getContentType())
                            .rno(savedReview.getRno())
                            .build();
                    resourceDtoList.add(dto);
                } catch (IOException e) {
                    log.error("파일 저장 중 오류 발생", e);
                    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            reviewResourceService.saveReview(resourceDtoList);
        }

        return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
    }

    @PutMapping("/{rno}")
    public ResponseEntity<Object> modifyReview(@PathVariable("rno") Long rno, @ModelAttribute ReviewDTO reviewDTO) {
        try {
            int ord = 0;
            List<ReviewResourceDTO> resourceDtoList = new ArrayList<ReviewResourceDTO>();
            log.info(reviewDTO);
            if (reviewDTO.getFiles() != null && !reviewDTO.getFiles().isEmpty()) {
                for (MultipartFile file : reviewDTO.getFiles()) {
                    Path savePath = Paths.get("C:\\upload", file.getOriginalFilename());
                    try {
                        file.transferTo(savePath);
                        ReviewResourceDTO dto = ReviewResourceDTO.builder()
                                .rr_name(file.getOriginalFilename())
                                .rr_ord(ord++)
                                .rr_type(file.getContentType())
                                .rno(rno)
                                .build();
                        resourceDtoList.add(dto);
                    } catch (Exception e) {
                        log.error("파일 저장 오류: {}", file.getOriginalFilename(), e);
                    }
                }
            }
            log.info("자원 관리 시작.");
            // 기존 자원 삭제
            reviewResourceService.deleteReview(rno);
            // 새로운 자원 저장
            reviewResourceService.saveReview(resourceDtoList);
            log.info("자원 관리 완료.");
            Review modifiedReview = reviewService.modifyReview(reviewDTO);
            return new ResponseEntity<>(modifiedReview, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            log.error("Review not found with ID: " + reviewDTO.getRno(), e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/read")
    public ResponseEntity<Object> getReadReview(@RequestParam Long rno) {
        ReviewDTO oneReview = reviewService.findOneReviewById(rno);
        if (oneReview != null && oneReview.getRno() != null) {
            return new ResponseEntity<>(oneReview, HttpStatus.OK);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found with id " + rno);
        }
    }

    @DeleteMapping("/{rno}")
        public ResponseEntity<Object> deleteReview(@PathVariable Long rno) {
        reviewService.deleteReview(rno);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/important")
    public ResponseEntity<List<ReviewDTO>> getImportantNotices() {
        List<ReviewDTO> importantReview = reviewService.findImportantReview();
        return new ResponseEntity<>(importantReview, HttpStatus.OK);
    }
}
