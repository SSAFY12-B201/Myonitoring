package com.myaicrosoft.myonitoring.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Column(length = 255)
    private String password;  // 소셜 로그인 사용자는 비밀번호 불필요

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

    @Column(nullable = false)
    @Builder.Default
    private boolean isProfileCompleted = false;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Device> devices;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Eye> eyes;

    public enum Provider {
        LOCAL, KAKAO, GOOGLE, NAVER
    }

    public enum Role {
        USER, ADMIN
    }
}
