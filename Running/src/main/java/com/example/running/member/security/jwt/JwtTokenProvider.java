package com.example.running.member.security.jwt;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;

public interface JwtTokenProvider {
    String createToken(String mid, String role);
    Authentication getAuthentication(HttpServletRequest request);
    boolean validateToken(String token);
    String resolveToken(HttpServletRequest request);

}
