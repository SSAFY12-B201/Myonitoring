package com.myaicrosoft.myonitoring.controller;

import com.myaicrosoft.myonitoring.service.FcmTokenService;
import com.myaicrosoft.myonitoring.util.JwtProvider;
import com.myaicrosoft.myonitoring.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final FcmTokenService fcmTokenService;
    private final SecurityUtil securityUtil;
    private final JwtProvider jwtProvider;

    // 내부 에러 응답 DTO
    private static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribeToTopic(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body
    ) {
        try {
            // 1. 토큰 추출 및 유효성 검사
            String token = extractTokenFromHeader(authHeader);

            if (!jwtProvider.validateToken(token)) {
                log.error("Invalid or expired token during notification subscription");
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Invalid or expired token"));
            }

            // 2. 토큰에서 사용자 ID 추출
            Long userId = jwtProvider.getUserIdFromToken(token);
            log.info("User ID extracted from token: {}", userId);

            // 3. FCM 토큰 검증
            String fcmToken = body.get("token");
            if (fcmToken == null || fcmToken.isEmpty()) {
                log.error("FCM Token is required but was null or empty");
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("FCM Token is required"));
            }

            // 4. 토큰 저장
            fcmTokenService.saveToken(fcmToken, userId);

            log.info("Successfully subscribed user {} to notifications", userId);
            return ResponseEntity.ok("Successfully subscribed to notifications");

        } catch (Exception e) {
            log.error("Notification subscription failed", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Subscription failed: " + e.getMessage()));
        }
    }

    // 토큰 추출 헬퍼 메서드
    private String extractTokenFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid Authorization header");
        }
        return authHeader.substring(7);
    }
}