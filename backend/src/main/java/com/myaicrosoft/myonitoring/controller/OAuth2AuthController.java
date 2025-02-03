package com.myaicrosoft.myonitoring.controller;

import com.myaicrosoft.myonitoring.model.dto.TokenDto;
import com.myaicrosoft.myonitoring.service.OAuth2AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class OAuth2AuthController {

    private final Map<String, OAuth2AuthService> authServices;

    @PostMapping("/{provider}/callback")
    public ResponseEntity<TokenDto> oauthCallback(
            @PathVariable String provider,
            @RequestParam String code) {
        OAuth2AuthService authService = authServices.get(provider.toLowerCase());
        if (authService == null) {
            throw new RuntimeException("Unsupported OAuth2 provider: " + provider);
        }
        
        TokenDto tokenDto = authService.authenticate(code);
        return ResponseEntity.ok(tokenDto);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenDto> refresh(
            @RequestHeader("Authorization") String refreshToken) {
        if (refreshToken != null && refreshToken.startsWith("Bearer ")) {
            refreshToken = refreshToken.substring(7);
        } else {
            throw new RuntimeException("Invalid refresh token format");
        }
        
        OAuth2AuthService anyAuthService = authServices.values().iterator().next();
        TokenDto tokenDto = anyAuthService.refreshToken(refreshToken);
        return ResponseEntity.ok(tokenDto);
    }
} 