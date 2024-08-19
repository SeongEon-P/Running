package com.example.running.Review.service;

import com.example.running.Notice.domain.NoticeResource;
import com.example.running.Notice.repository.NoticeRepository;
import com.example.running.Notice.repository.NoticeResourceRepository;
import com.example.running.Review.domain.ReviewResource;
import com.example.running.Review.dto.ReviewResourceDTO;
import com.example.running.Review.respository.ReviewRepository;
import com.example.running.Review.respository.ReviewResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ReviewResourceServiceImpl implements ReviewResourceService {
    private final ReviewResourceRepository reviewResourceRepository;
    private final ModelMapper modelMapper;
    private final ReviewRepository reviewRepository;

    @Override
    public void saveReview(List<ReviewResourceDTO> resourceDTOList) {
        List<ReviewResource> resourceList =
                resourceDTOList.stream().map
                        (dto -> modelMapper.map(dto, ReviewResource.class)
                        ).collect(Collectors.toList());
        reviewResourceRepository.saveAll(resourceList);
    }

    @Override
    public void deleteReview(Long rrno) {
        reviewResourceRepository.deleteById(rrno);
    }

    @Override
    public int getMaxOrd(Long rno) {
        return reviewResourceRepository.getMaxOrd(rno);
    }
}
