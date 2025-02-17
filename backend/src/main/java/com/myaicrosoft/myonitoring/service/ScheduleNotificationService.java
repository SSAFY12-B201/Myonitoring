package com.myaicrosoft.myonitoring.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * ScheduleNotificationService
 * - Firebase 알림 전송 서비스 클래스
 */
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
@Slf4j
public class ScheduleNotificationService {

    /**
     * 유저 ID를 기반으로 Firebase로 알림 메시지를 전송하는 메서드
     *
     * @param userId 유저 ID
     * @param title  알림 제목
     * @param body   알림 본문
     */
    public void sendNotification(Long userId, String title, String body) {
        try {
            // Firebase 메시지 구성 (유저 ID를 토픽으로 사용)
            Message message = Message.builder()
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .setTopic("user-" + userId) // 유저 ID 기반 토픽 생성
                    .build();

            // 메시지 전송
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Successfully sent notification to user {}: {}", userId, response);
        } catch (Exception e) {
            log.error("Error sending notification to user {}", userId, e);
        }
    }
}
