package com.example.running.member.service;

public interface EmailService {
    void sendPasswordResetEmail(String email, String token);
}
