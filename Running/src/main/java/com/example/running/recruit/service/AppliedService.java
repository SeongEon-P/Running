package com.example.running.recruit.service;

import com.example.running.recruit.domain.Applied;
import com.example.running.recruit.dto.AppliedDTO;

import java.util.List;
import java.util.Optional;

public interface AppliedService {

    // 신청
    AppliedDTO applicate(AppliedDTO appliedDTO);

    // 신청 취소
    void cancelApplication(Long ano);

    // 신청 목록
    Optional<Applied> getAppliedByAno(Long ano);

}
