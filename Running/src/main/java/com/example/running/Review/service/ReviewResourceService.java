package com.example.running.Review.service;

import com.example.running.Review.domain.ReviewResource;
import com.example.running.Review.dto.ReviewResourceDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReviewResourceService {
    void saveReview(List<ReviewResourceDTO> resourceDTOList);
    void deleteReview(Long rrno);
    int getMaxOrd(Long rno);

}
