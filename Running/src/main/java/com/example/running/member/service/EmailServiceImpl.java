package com.example.running.member.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;


@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendPasswordResetEmail(String email, String token) {
        String resetLink = "http://localhost:3000/resetpassword?token=" + token;
        String messageContent = "<p>비밀번호를 재설정하려면 아래 링크를 클릭하세요:</p>"
                + "<a href=\"" + resetLink + "\">비밀번호 재설정</a>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("비밀번호 재설정 링크");
            helper.setText(messageContent, true); // true는 HTML을 활성화하는 플래그

            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            // 예외 처리 로직 추가
        }
    }
}