package com.example.running.Review.service;

import com.example.running.Notice.domain.Notice;
import com.example.running.Notice.dto.NoticeDTO;
import com.example.running.Review.domain.Review;
import com.example.running.Review.domain.ReviewResource;
import com.example.running.Review.dto.ReviewDTO;
import com.example.running.Review.dto.ReviewResourceDTO;
import com.example.running.Review.respository.ReviewRepository;
import com.example.running.Review.respository.ReviewResourceRepository;
import com.example.running.member.domain.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReviewResourceService reviewResourceService;
    private final ModelMapper modelMapper;
    private final ReviewResourceRepository reviewResourceRepository;

    @Override
    public List<ReviewDTO> findAllReview() {
        List<Review> reviews = reviewRepository.findAll();
        List<ReviewDTO> reviewDTOList = reviews.stream().map(review -> modelMapper.map(review, ReviewDTO.class)).collect(Collectors.toList());
        return reviewDTOList;
    }

    @Override
    public ReviewDTO addReview(ReviewDTO reviewDTO) {
        Review review = Review.builder()
                .r_title(reviewDTO.getR_title())
                .r_content(reviewDTO.getR_content())
                .r_image(reviewDTO.getR_image())
                .writer(reviewDTO.getWriter())
                .build();
        Review savedReview = reviewRepository.save(review);
        return modelMapper.map(savedReview, ReviewDTO.class);
    }

    @Override
    public ReviewDTO findOneReviewById(Long rno) {
        Optional<Review> result=reviewRepository.findById(rno);
        Review review = result.orElseThrow();
        Set<ReviewResource> rrList = review.getReviewResourceSet();
        List<ReviewResourceDTO> rrDtoList = new ArrayList<>();
        for(ReviewResource reviewResource : rrList) {
            rrDtoList.add(ReviewResourceDTO.builder()
                    .rrno(reviewResource.getRrno())
                    .file_size(reviewResource.getFile_size())
                    .rr_name(reviewResource.getRr_name())
                    .rr_ord(reviewResource.getRr_ord())
                    .rr_path(reviewResource.getRr_path())
                    .rr_type(reviewResource.getRr_type())
                    .rno(reviewResource.getReview().getRno())
                    .build());
        }
        ReviewDTO reviewListDTO = ReviewDTO.builder()
                .rno(review.getRno())
                .r_title(review.getR_title())
                .r_content(review.getR_content())
                .r_image(review.getR_image())
                .writer(review.getWriter())
                .regDate(review.getRegDate())
                .review_resource(rrDtoList)
                .build();
        return reviewListDTO;
    }

    @Override
    public void deleteReview(Long rno) {
        reviewRepository.deleteById(rno);
        reviewResourceRepository.deleteById(rno);

    }

    @Override
    public Review modifyReview(ReviewDTO reviewDTO) {
        Optional<Review> result = reviewRepository.findById(reviewDTO.getRno());
        if(!result.isPresent()){
            throw new NoSuchElementException("Notice Not Found with ID: " + reviewDTO.getRno());
        }
        Review review = result.get();
        review.changeNotice(
                reviewDTO.getR_title(),
                reviewDTO.getR_content(),
                reviewDTO.getR_image(),
                Member.builder().mid(reviewDTO.getWriter()).build()
        );
        Review savedReview = reviewRepository.save(review);
        return savedReview;
    }

    @Override
    public List<ReviewDTO> findLatestReviews() {
        List<Review> reviews = reviewRepository.findTop5ByOrderByRegDateDesc();
        return reviews.stream()
                .map(review -> modelMapper.map(review, ReviewDTO.class))
                .collect(Collectors.toList());
    }
}
