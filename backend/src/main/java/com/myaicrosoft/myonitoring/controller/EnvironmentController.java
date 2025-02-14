package com.myaicrosoft.myonitoring.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/env")
public class EnvironmentController {

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;

    @GetMapping("/oauth/kakao")
    public Map<String, String> getKakaoOAuthConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("KAKAO_REDIRECT_URI", kakaoRedirectUri);
        config.put("KAKAO_CLIENT_ID", kakaoClientId);
        
        return config;
    }
} 