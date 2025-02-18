package com.myaicrosoft.myonitoring.controller;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.myaicrosoft.myonitoring.model.dto.AlertRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @PostMapping("/alert")
    public ResponseEntity<String> sendAlert(@RequestBody AlertRequest alertRequest) {
        try {
            String title;
            String body;

            // 알림 타입에 따른 메시지 설정
            if ("FOOD".equals(alertRequest.getType())) {
                title = "사료 배급량 이상 감지";
                body = String.format("사료 배급량이 비정상적입니다: %.2f", alertRequest.getValue());
            } else if ("EYE".equals(alertRequest.getType())) {
                title = "눈 건강 이상 감지";
                body = String.format("반려동물의 눈 건강에 이상이 감지되었습니다: %.2f", alertRequest.getValue());
            } else {
                return ResponseEntity.badRequest().body("Invalid alert type");
            }

            // Firebase 메시지 구성
            Message message = Message.builder()
                .setNotification(Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build())
                .setTopic("alerts") // 모든 구독된 클라이언트에게 전송
                .build();

            // 메시지 전송
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Successfully sent notification: {}", response);
            
            return ResponseEntity.ok("Notification sent successfully");
        } catch (Exception e) {
            log.error("Error sending notification", e);
            return ResponseEntity.internalServerError().body("Error sending notification: " + e.getMessage());
        }
    }
}
