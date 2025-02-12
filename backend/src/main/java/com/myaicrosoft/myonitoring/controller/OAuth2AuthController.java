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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    @PostMapping("/{provider}/authenticate")
    public ResponseEntity<Map<String, Object>> authenticate(
            @PathVariable String provider,
            @RequestParam String code) {
        OAuth2AuthService authService = authServices.get(provider.toLowerCase());
        if (authService == null) {
            throw new RuntimeException("Unsupported OAuth2 provider: " + provider);
        }

        Map<String, Object> authInfo = authService.authenticate(code);
        return ResponseEntity.ok(authInfo);
    }

    @PostMapping("/{provider}/register")
    public ResponseEntity<TokenDto> register(
            @PathVariable String provider,
            @RequestParam String authToken,
            @RequestBody UserRegistrationDto registrationDto,
            HttpServletResponse response) {
        OAuth2AuthService authService = authServices.get(provider.toLowerCase());
        if (authService == null) {
            throw new RuntimeException("Unsupported OAuth2 provider: " + provider);
        }

        TokenDto tokenDto = authService.register(authToken, registrationDto);

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
    public ResponseEntity<Map<String, String>> signOut(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            Authentication authentication,
            HttpServletResponse response) {
        try {
            log.info("Signing out user...");
            String email = authentication != null ? authentication.getName() : null;

            // DB에서 리프레시 토큰 제거 및 로그아웃 처리
            userService.logout(email, refreshToken);

            // 리프레시 토큰 쿠키 삭제
            ResponseCookie cookie = createRefreshTokenCookie("", 0);
            log.info("Created deletion cookie: {}", cookie.toString());
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.ok(Map.of("message", "Successfully logged out"));
        } catch (Exception e) {
            log.error("Logout failed: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Logout failed: " + e.getMessage()));
        }
    }
} 