package com.example.running.recruit.service;

import com.example.running.recruit.domain.Applied;
import com.example.running.recruit.dto.AppliedDTO;

import java.util.List;

public interface AppliedService {

    // 신청
    AppliedDTO applicate(AppliedDTO appliedDTO);

    // 신청 취소
    void cancelApplication(Long ano);

    // 신청 목록
    List<Applied> getAppliedByRno(Long rno);

}
