package com.myaicrosoft.myonitoring.controller;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.myaicrosoft.myonitoring.model.dto.AlertRequest;
import com.myaicrosoft.myonitoring.service.FcmTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import com.myaicrosoft.myonitoring.util.SecurityUtil;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final FcmTokenService fcmTokenService;
    private final SecurityUtil securityUtil;

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribeToTopic(
        @RequestBody Map<String, String> body,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            // 먼저 인증 체크
            if (userDetails == null) {
                log.error("Authentication required - userDetails is null");
                return ResponseEntity.status(401).body("Authentication required");

            log.info("User: {}", userDetails.getUsername());

            // 그 다음 토큰 체크
            String token = body.get("token");
            if (token == null || token.isEmpty()) {
                log.error("Token is required but was null or empty");
                return ResponseEntity.badRequest().body("Token is required");
            }
            log.info("Subscribing to {}", token);

            // SecurityUtil을 사용하여 현재 사용자의 ID를 가져옴
            Long userId = securityUtil.getCurrentUserId();
            log.info("User ID from SecurityUtil: {}", userId);

            // 토큰 저장 및 구독 처리
            fcmTokenService.saveToken(token, userId);
            
            return ResponseEntity.ok("Successfully subscribed to alerts topic");
        } catch (Exception e) {
            log.error("Failed to subscribe to topic", e);
            return ResponseEntity.status(500).body("Failed to subscribe: " + e.getMessage());
        }
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
