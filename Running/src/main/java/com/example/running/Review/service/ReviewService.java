package com.example.running.Review.service;

import com.example.running.Notice.dto.NoticeDTO;
import com.example.running.Review.domain.Review;
import com.example.running.Review.dto.ReviewDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReviewService {
    List<ReviewDTO> findAllReview();
    ReviewDTO addReview(ReviewDTO reviewDTO);
    ReviewDTO findOneReviewById(Long rno);
    void deleteReview(Long rno);
    Review modifyReview(ReviewDTO reviewDTO);
    List<ReviewDTO> findLatestReviews();
    List<ReviewDTO> findImportantReview();
}
