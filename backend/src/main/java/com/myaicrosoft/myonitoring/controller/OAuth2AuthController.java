package com.myaicrosoft.myonitoring.controller;

import com.myaicrosoft.myonitoring.model.dto.TokenDto;
import com.myaicrosoft.myonitoring.model.dto.UserRegistrationDto;
import com.myaicrosoft.myonitoring.service.OAuth2AuthService;
import com.myaicrosoft.myonitoring.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
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
            HttpServletResponse response) {
        OAuth2AuthService authService = authServices.get(provider.toLowerCase());
        if (authService == null) {
            throw new RuntimeException("Unsupported OAuth2 provider: " + provider);
        }
        
        TokenDto tokenDto = authService.signIn(code, new UserRegistrationDto());
        
        // HTTP-only cookie에 refresh token 저장
        ResponseCookie cookie = ResponseCookie.from("refresh_token", tokenDto.getRefreshToken())
            .httpOnly(true)
            .secure(true)
            .path("/auth/token/refresh")
            .maxAge(7 * 24 * 60 * 60) // 7 days
            .sameSite("Strict")
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        
        // response body에서 refresh token 삭제
        TokenDto responseDto = TokenDto.builder()
            .grantType(tokenDto.getGrantType())
            .accessToken(tokenDto.getAccessToken())
            .accessTokenExpiresIn(tokenDto.getAccessTokenExpiresIn())
            .build();
            
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/token/refresh")
    public ResponseEntity<TokenDto> refreshToken(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response) {
        if (refreshToken == null) {
            throw new RuntimeException("Refresh token not found");
        }
        
        OAuth2AuthService anyAuthService = authServices.values().iterator().next();
        TokenDto tokenDto = anyAuthService.refreshToken(refreshToken);
        
        // refresh token 갱신
        ResponseCookie cookie = ResponseCookie.from("refresh_token", tokenDto.getRefreshToken())
            .httpOnly(true)
            .secure(true)
            .path("/auth/token/refresh")
            .maxAge(7 * 24 * 60 * 60) // 7 days
            .sameSite("Strict")
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        
        // access token만 반환
        TokenDto responseDto = TokenDto.builder()
            .grantType(tokenDto.getGrantType())
            .accessToken(tokenDto.getAccessToken())
            .accessTokenExpiresIn(tokenDto.getAccessTokenExpiresIn())
            .build();
            
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/signout")
    public ResponseEntity<Void> signOut(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestHeader("Authorization") String bearerToken,
            HttpServletResponse response) {
        if (bearerToken.startsWith("Bearer ")) {
            String accessToken = bearerToken.substring(7);
            userService.logout(userDetails.getUsername(), accessToken);
            
            // Clear refresh token cookie
            ResponseCookie cookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/auth/token/refresh")
                .maxAge(0)
                .sameSite("Strict")
                .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        }
        return ResponseEntity.ok().build();
    }
} 