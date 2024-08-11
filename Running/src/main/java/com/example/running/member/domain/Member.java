package com.example.running.member.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.management.relation.Role;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name="member")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true, length = 20)
    private String mid;

    @Column(nullable = false)
    private String mpw;

    @Column(nullable = false, length = 45)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, unique = true, length = 17)
    private String phone;

    @Column(nullable = false, length = 400)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDate date;

//    @Transient
//    public String token;

}
