package com.myaicrosoft.myonitoring.controller;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.myaicrosoft.myonitoring.model.dto.AlertRequest;
import com.myaicrosoft.myonitoring.service.FcmTokenService;
import com.myaicrosoft.myonitoring.util.JwtProvider;
import com.myaicrosoft.myonitoring.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

            // 4. 토큰 저장 및 구독 처리
            fcmTokenService.saveToken(fcmToken, userId);

            log.info("Successfully subscribed user {} to notifications", userId);
            return ResponseEntity.ok("Successfully subscribed to alerts");

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


    @PostMapping("/alert")
    public ResponseEntity<String> sendAlert(@RequestBody AlertRequest alertRequest) {
        try {
            String title;
            String body;

            if ("FOOD".equals(alertRequest.getType())) {
                title = "사료 배급량 이상 감지";
                body = String.format("사료 배급량이 비정상적입니다: %.2f", alertRequest.getValue());
            } else if ("EYE".equals(alertRequest.getType())) {
                title = "눈 건강 이상 감지";
                body = String.format("반려동물의 눈 건강에 이상이 감지되었습니다: %.2f", alertRequest.getValue());
            } else {
                return ResponseEntity.badRequest().body("Invalid alert type");
            }

            // 활성화된 토큰들 가져오기
            List<String> tokens = fcmTokenService.getActiveTokens();
            if (tokens.isEmpty()) {
                return ResponseEntity.ok("No active tokens found");
            }

            // 각 토큰에 대해 메시지 전송
            for (String token : tokens) {
                Message message = Message.builder()
                        .setNotification(Notification.builder()
                                .setTitle(title)
                                .setBody(body)
                                .build())
                        .setToken(token)  // 토픽 대신 특정 토큰으로 전송
                        .build();

                String response = FirebaseMessaging.getInstance().send(message);
                log.info("Successfully sent notification to token {}: {}", token, response);
            }

            return ResponseEntity.ok("Notifications sent successfully");
        } catch (Exception e) {
            log.error("Error sending notifications", e);
            return ResponseEntity.internalServerError().body("Error sending notifications: " + e.getMessage());
        }
    }
}