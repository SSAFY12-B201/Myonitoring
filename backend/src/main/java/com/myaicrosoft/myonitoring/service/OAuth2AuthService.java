package com.myaicrosoft.myonitoring.service;

import com.myaicrosoft.myonitoring.model.dto.TokenDto;
import com.myaicrosoft.myonitoring.model.dto.UserRegistrationDto;

import java.util.Map;

public interface OAuth2AuthService {
    Map<String, Object> authenticate(String code);
    TokenDto register(String authToken, UserRegistrationDto registrationDto);
    TokenDto refreshToken(String refreshToken);
} 