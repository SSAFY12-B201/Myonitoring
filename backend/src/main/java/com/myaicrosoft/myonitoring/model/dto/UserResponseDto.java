package com.myaicrosoft.myonitoring.model.dto;

import com.myaicrosoft.myonitoring.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String email;
    private String provider;
    private String nickname;
    private String address;
    private String phoneNumber;
    
    public static UserResponseDto from(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .provider(user.getProvider().name())
                .nickname(user.getNickname())
                .address(user.getAddress())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
} 