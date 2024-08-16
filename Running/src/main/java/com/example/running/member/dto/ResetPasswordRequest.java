package com.example.running.member.dto;

public class ResetPasswordRequest {
    private String token;
    private String newPassword;

    // 기본 생성자
    public ResetPasswordRequest() {}

    // 인자 생성자
    public ResetPasswordRequest(String token, String newPassword) {
        this.token = token;
        this.newPassword = newPassword;
    }

    // Getter와 Setter
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
