package com.myaicrosoft.myonitoring.scheduler;

import com.myaicrosoft.myonitoring.model.entity.Cat;
import com.myaicrosoft.myonitoring.model.entity.Statistics;
import com.myaicrosoft.myonitoring.model.entity.NotificationLog;
import com.myaicrosoft.myonitoring.model.entity.NotificationCategory;
import com.myaicrosoft.myonitoring.repository.StatisticsRepository;
import com.myaicrosoft.myonitoring.repository.NotificationLogRepository;
import com.myaicrosoft.myonitoring.service.ScheduleNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.myaicrosoft.myonitoring.model.entity.IntakeStatistics;
import com.myaicrosoft.myonitoring.repository.IntakeStatisticsRepository;
import com.myaicrosoft.myonitoring.service.FcmTokenService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * ScheduleNotification
 * - 이상 알림 데이터를 Firebase로 전달합니다.
 */
@Component // Spring Bean으로 등록
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
@Slf4j
public class ScheduleNotification {

    private final StatisticsRepository statisticsRepository; // Statistics 데이터를 조회하는 Repository
    private final NotificationLogRepository notificationLogRepository; // 알림 로그 저장 Repository
    private final ScheduleNotificationService scheduleNotificationService; // Firebase 알림 전송 서비스
    private final IntakeStatisticsRepository intakeStatisticsRepository;
    private final FcmTokenService fcmTokenService;

    /**
     * 매일 자정에 실행되는 스케줄링 작업 (의료 일정 알림 예약)
     */
    @Scheduled(cron = "0 18 21 * * *", zone = "Asia/Seoul") // 매일 자정 (KST)
    public void scheduleDailyMedicalAlerts() {
        log.info("🔔 의료 일정 알림 예약 시작...");
        scheduleNotificationService.scheduleMedicalAlerts();
        log.info("✅ 의료 일정 알림 예약 완료.");
    }

    /**
     * 매일 오전 10시에 실행되는 스케줄링 작업 (섭취량 이상 알림 전송)
     */
    @Scheduled(cron = "0 0 10 * * *") // 매일 오전 9시에 실행
    public void checkIntakeAnomalies() {
        try {
            List<IntakeStatistics> statistics = intakeStatisticsRepository.findByChangeDaysGreaterThanEqual(2);
            log.info("섭취량 이상 데이터 조회 완료. 데이터 수: {}", statistics.size());

            statistics.forEach(stat -> {
                String catName = stat.getCat().getName();
                int changeDays = stat.getChangeDays();
                int changeStatus = stat.getChangeStatus();

                if (changeDays >= 2) { // changeDays가 2 이상인 경우만 알림 전송
                    Cat cat = stat.getCat();
                    String title = "섭취량 이상 감지";
                    String body = String.format("고양이 %s의 섭취량 이상이 감지되었습니다!\n" +
                                    "%d일 연속 섭취량이 %s하였으니, %s의 건강 상태를 확인해주세요.",
                            catName, changeDays, (changeStatus == -1 ? "감소" : "증가"), catName);

                    log.info("파이어베이스로 전송되는 데이터:");
                    log.info("제목: {}", title);
                    log.info("내용: {}", body);

                    // FCM 토큰 기반 알림 전송
                    Long userId = cat.getDevice().getUser().getId();
                    List<String> userTokens = fcmTokenService.getActiveTokensByUserId(userId);

                    if (userTokens.isEmpty()) {
                        log.warn("사용자 {}의 활성화된 FCM 토큰이 없습니다.", userId);
                        return;
                    }

                    for (String token : userTokens) {
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
                            continue;
                        }
                    }

                    // NotificationLog 엔티티에 데이터 저장
                    NotificationLog notificationLog = NotificationLog.builder()
                            .cat(cat)
                            .notificationDateTime(LocalDateTime.now())
                            .category(NotificationCategory.INTAKE)
                            .message(body)
                            .build();
                    notificationLogRepository.save(notificationLog);

                    log.info("Firebase로 섭취량 이상 알림 전송 및 로그 저장 완료 (고양이: {}, 유저 ID: {})",
                            catName, userId);
                } else {
                    log.info("섭취량 이상 데이터가 없어 알림이 전송되지 않았습니다 (고양이: {}).", catName);
                }
            });
        } catch (Exception e) {
            log.error("섭취량 이상 알림 데이터 전송 중 오류 발생", e);
        }
    }
}
