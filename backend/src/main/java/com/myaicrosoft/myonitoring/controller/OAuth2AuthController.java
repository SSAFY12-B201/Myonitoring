package com.myaicrosoft.myonitoring.controller;

import com.myaicrosoft.myonitoring.model.dto.TokenDto;
import com.myaicrosoft.myonitoring.model.dto.UserRegistrationDto;
import com.myaicrosoft.myonitoring.service.OAuth2AuthService;
import com.myaicrosoft.myonitoring.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class OAuth2AuthController {

    private final Map<String, OAuth2AuthService> authServices;
    private final UserService userService;

    @PostMapping("/{provider}/signin")
    public ResponseEntity<TokenDto> signInWithProvider(
            @PathVariable String provider,
            @RequestParam String code,
            @RequestBody UserRegistrationDto registrationDto) {
        OAuth2AuthService authService = authServices.get(provider.toLowerCase());
        if (authService == null) {
            throw new RuntimeException("Unsupported OAuth2 provider: " + provider);
        }
        
        TokenDto tokenDto = authService.signIn(code, registrationDto);
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

    @PostMapping("/signout")
    public ResponseEntity<Void> signOut(@AuthenticationPrincipal UserDetails userDetails) {
        userService.logout(userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
} 