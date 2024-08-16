package com.example.running.member.dto;

import com.example.running.member.domain.Role;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MemberDTO {
        private String mid;
        private String name;
        private String email;
        private String phone;
        private String address;
        private Role role;
        private LocalDateTime date;
        protected void onCreate() {
            date = LocalDateTime.now(); // 엔티티가 처음 저장될 때 현재 시간 설정
        }
}
