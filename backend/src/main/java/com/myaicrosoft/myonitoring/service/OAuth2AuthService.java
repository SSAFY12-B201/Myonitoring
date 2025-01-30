package com.myaicrosoft.myonitoring.service;

import com.myaicrosoft.myonitoring.model.dto.TokenDto;

public interface OAuth2AuthService {
    TokenDto authenticate(String code);
    TokenDto refreshToken(String refreshToken);
} 