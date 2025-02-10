package com.myaicrosoft.myonitoring.service;

import com.myaicrosoft.myonitoring.model.dto.TokenDto;
import com.myaicrosoft.myonitoring.model.dto.UserRegistrationDto;

public interface OAuth2AuthService {
    TokenDto signIn(String code, UserRegistrationDto registrationDto);
    TokenDto refreshToken(String refreshToken);
} 