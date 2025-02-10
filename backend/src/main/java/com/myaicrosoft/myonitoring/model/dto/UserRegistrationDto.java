package com.myaicrosoft.myonitoring.model.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDto {
    private String email;
    private String nickname;
    private String address;
    private String phoneNumber;
} 