package com.example.running.member.dto;


// JwtAuthenticationResponse 클래스는 단순히 JWT 토큰을 클라이언트에게 반환하는 역할을 하는 DTO
// 이 클래스를 생성하지 않고도 반환할 수는 있지만, 그럴 경우에는 단순히 문자열 또는 JSON 객체로 반환
public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";

    public JwtAuthenticationResponse(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
}
