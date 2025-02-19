package com.myaicrosoft.myonitoring.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.myaicrosoft.myonitoring.model.entity.Medical;
import com.myaicrosoft.myonitoring.repository.MedicalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;

/**
 * ScheduleNotificationService
 * - Firebase 알림 전송 서비스 클래스
 */
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
@Slf4j
public class ScheduleNotificationService {

    private final MedicalRepository medicalRepository;
    private final ThreadPoolTaskScheduler taskScheduler; // ThreadPoolTaskScheduler 주입

    /**
     * 유저 ID를 기반으로 Firebase로 알림 메시지를 전송하는 메서드
     *
     * @param userId 유저 ID
     * @param title  알림 제목
     * @param body   알림 본문
     */
    public void sendNotification(Long userId, String title, String body) {
        try {
            Message message = Message.builder()
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .setTopic("user-" + userId) // 유저 ID 기반 토픽 생성
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Successfully sent notification to user {}: {}", userId, response);
        } catch (Exception e) {
            log.error("Error sending notification to user {}", userId, e);
        }
    }

    /**
     * 매일 자정에 실행되는 의료 일정 알림 예약 작업
     */
    @Transactional
    public void scheduleMedicalAlerts() {
        LocalDate today = LocalDate.now(); // 오늘 날짜 가져오기

        List<Medical> medicals = medicalRepository.findByVisitDate(today);

        log.info("오늘({}) 의료 기록 개수: {}", today, medicals.size());

        medicals.forEach(medical -> {
            String catName = medical.getCat().getName();
            String medicalCategory = convertCategory(medical.getCategory().name());
            LocalDateTime notificationTime = LocalDateTime.of(today, medical.getVisitTime()).minusHours(1); // 1시간 전 계산

            if (notificationTime.isAfter(LocalDateTime.now())) {
                scheduleNotification(medical.getCat().getDevice().getUser().getId(), notificationTime, catName, medicalCategory, today, medical.getVisitTime());
            } else {
                log.warn("이미 지난 일정({})에 대한 알림은 예약하지 않습니다.", notificationTime);
            }
        });
    }


    /**
     * 특정 시간에 Firebase 알림을 예약하는 메서드
     */
    private void scheduleNotification(Long userId, LocalDateTime notificationTime, String catName, String medicalCategory, LocalDate visitDate, LocalTime visitTime) {
        long delayMillis = Duration.between(LocalDateTime.now(), notificationTime).toMillis();

        taskScheduler.schedule(() -> sendNotificationWithDetails(userId, catName, medicalCategory, visitDate, visitTime), Instant.now().plusMillis(delayMillis));

        log.info("유저 {}의 알림이 {}에 예약되었습니다.", userId, notificationTime);
    }

    /**
     * Firebase 알림 전송 메서드 (예약된 작업에서 호출됨)
     */
    private void sendNotificationWithDetails(Long userId, String catName, String medicalCategory, LocalDate visitDate, LocalTime visitTime) {
        String title = "일정 알림";
        String body = String.format("오늘(%s) %s에 %s의 %s 일정이 예정되어 있습니다.", visitDate, visitTime, catName, medicalCategory);

        try {
            Message message = Message.builder()
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .setTopic("user-" + userId)
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("유저 {}에게 성공적으로 알림 전송: {}", userId, body);
        } catch (Exception e) {
            log.error("유저 {}에게 알림 전송 실패: {}", userId, e.getMessage());
        }
    }

    /**
     * 의료 카테고리 변환 메서드 (영어 → 한글)
     */
    private String convertCategory(String category) {
        switch (category.toLowerCase()) {
            case "checkup":
                return "정기검진";
            case "treatment":
                return "치료";
            case "other":
                return "기타";
            default:
                return "알 수 없음";
        }
    }
}
