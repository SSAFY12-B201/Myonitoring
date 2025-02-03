package com.myaicrosoft.myonitoring.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider; // 소셜 제공자: KAKAO, GOOGLE 등

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password; // 암호화된 비밀번호

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // 사용자 권한: USER, ADMIN

    @Column(length = 255)
    private String refreshToken;

    @Column(length = 255)
    private String nickname;

    @Column(length = 255)
    private String address;

    @Column(length = 255)
    private String phoneNumber;

    public enum Provider {
        LOCAL, KAKAO, GOOGLE, NAVER
    }

    public enum Role {
        USER, ADMIN
    }
}
