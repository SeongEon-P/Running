package com.example.running.member.dto;

public class FindMemberResponse {
    private String mid;

    // 기본 생성자
    public FindMemberResponse() {}

    // 인자 생성자
    public FindMemberResponse(String mid) {
        this.mid = mid;
    }

    // Getter와 Setter
    public String getMid() {
        return mid;
    }

    public void setMid(String mid) {
        this.mid = mid;
    }
}
