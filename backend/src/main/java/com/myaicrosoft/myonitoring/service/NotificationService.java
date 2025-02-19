package com.myaicrosoft.myonitoring.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final FcmTokenService fcmTokenService;
    private final NotificationLogRepository notificationLogRepository;

    /**
     * FCM 토큰 기반 알림 전송 (로그 미저장)
     */
    public void sendNotification(Long userId, String title, String body) {
        try {
            List<String> userTokens = fcmTokenService.getActiveTokensByUserId(userId);
            
            if (userTokens.isEmpty()) {
                log.warn("사용자 {}의 활성화된 FCM 토큰이 없습니다.", userId);
                return;
            }

            sendToTokens(userTokens, title, body);
        } catch (Exception e) {
            log.error("알림 전송 중 오류 발생 - 사용자: {}, 에러: {}", userId, e.getMessage());
        }
    }

    /**
     * FCM 토큰 기반 알림 전송 및 로그 저장
     */
    public void sendNotificationWithLog(Cat cat, String title, String body, NotificationCategory category) {
        try {
            Long userId = cat.getDevice().getUser().getId();
            List<String> userTokens = fcmTokenService.getActiveTokensByUserId(userId);
            
            if (userTokens.isEmpty()) {
                log.warn("사용자 {}의 활성화된 FCM 토큰이 없습니다.", userId);
                return;
            }

            sendToTokens(userTokens, title, body);

            // 알림 로그 저장
            NotificationLog notificationLog = NotificationLog.builder()
                    .cat(cat)
                    .notificationDateTime(LocalDateTime.now())
                    .category(category)
                    .message(body)
                    .build();
            notificationLogRepository.save(notificationLog);
            
            log.info("알림 로그 저장 완료 - 고양이: {}, 카테고리: {}", cat.getName(), category.getDescription());

        } catch (Exception e) {
            log.error("알림 처리 중 오류 발생 - 고양이: {}, 카테고리: {}, 에러: {}", 
                    cat.getName(), category.getDescription(), e.getMessage());
        }
    }

    /**
     * FCM 토큰 리스트로 알림 전송
     */
    private void sendToTokens(List<String> tokens, String title, String body) {
        for (String token : tokens) {
            Message message = Message.builder()
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .setToken(token)
                    .build();

            try {
                String response = FirebaseMessaging.getInstance().send(message);
                log.info("알림 전송 성공 - 토큰: {}, 응답: {}", token, response);
            } catch (Exception e) {
                log.error("알림 전송 실패 - 토큰: {}, 에러: {}", token, e.getMessage());
            }
        }
    }
} 