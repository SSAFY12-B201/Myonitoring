package com.myaicrosoft.myonitoring.controller;

import com.myaicrosoft.myonitoring.model.dto.TokenDto;
import com.myaicrosoft.myonitoring.model.dto.UserRegistrationDto;
import com.myaicrosoft.myonitoring.service.OAuth2AuthService;
import com.myaicrosoft.myonitoring.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class OAuth2AuthController {

    private final Map<String, OAuth2AuthService> authServices;
    private final UserService userService;

    @Value("${cookie.secure}")
    private boolean cookieSecure;

    @Value("${app.api-prefix}")
    private String apiPrefix;

    private ResponseCookie createRefreshTokenCookie(String refreshToken, long maxAge) {
        return ResponseCookie.from("refresh_token", refreshToken)
            .httpOnly(true)
            .secure(cookieSecure)
            .path(apiPrefix + "/auth")
            .maxAge(maxAge)
            .sameSite("None")
            .build();
    }

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
        ResponseCookie cookie = createRefreshTokenCookie(tokenDto.getRefreshToken(), 7 * 24 * 60 * 60); // 7 days
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
            @RequestHeader(value = "Cookie", required = false) String cookieHeader,
            HttpServletResponse response) {
        log.info("Received refresh token request");
        log.debug("Cookie header: {}", cookieHeader);
        
        if (refreshToken == null) {
            log.error("Refresh token is null");
            throw new RuntimeException("Refresh token not found");
        }
        
        log.debug("Refresh token found: {}", refreshToken.substring(0, Math.min(refreshToken.length(), 10)) + "...");
        
        OAuth2AuthService anyAuthService = authServices.values().iterator().next();
        TokenDto tokenDto = anyAuthService.refreshToken(refreshToken);
        
        // refresh token 갱신
        ResponseCookie cookie = createRefreshTokenCookie(tokenDto.getRefreshToken(), 7 * 24 * 60 * 60); // 7 days
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        log.debug("New refresh token cookie: {}", cookie.toString());
        
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
            ResponseCookie cookie = createRefreshTokenCookie("", 0);
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        }
        return ResponseEntity.ok().build();
    }
} 