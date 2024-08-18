package com.example.running.member.dto;

public class FindMemberRequest {
    private String email;

    // 기본 생성자
    public FindMemberRequest() {}

    // 인자 생성자
    public FindMemberRequest(String email) {
        this.email = email;
    }

    // Getter와 Setter
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
