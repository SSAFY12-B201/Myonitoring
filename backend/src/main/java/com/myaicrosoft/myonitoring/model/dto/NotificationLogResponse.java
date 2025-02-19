package com.myaicrosoft.myonitoring.model.dto;

import com.myaicrosoft.myonitoring.model.entity.NotificationCategory;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * NotificationLogResponse
 * - 알림 로그 응답 DTO 클래스
 */
@Data
@AllArgsConstructor
public class NotificationLogResponse {
    private Long id;                      // 알림 로그 ID
    private String time;                  // 알림 시간 (HH:mm 형식)
    private NotificationCategory category; // 알림 카테고리 (INTAKE, DEVICE, EYE)
    private String message;               // 알림 메시지
}
