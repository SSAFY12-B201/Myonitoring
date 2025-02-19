package com.myaicrosoft.myonitoring.scheduler;

import com.myaicrosoft.myonitoring.model.entity.Cat;
import com.myaicrosoft.myonitoring.model.entity.IntakeStatistics;
import com.myaicrosoft.myonitoring.model.entity.NotificationCategory;
import com.myaicrosoft.myonitoring.repository.StatisticsRepository;
import com.myaicrosoft.myonitoring.repository.NotificationLogRepository;
import com.myaicrosoft.myonitoring.service.ScheduleNotificationService;
import com.myaicrosoft.myonitoring.repository.IntakeStatisticsRepository;
import com.myaicrosoft.myonitoring.service.FcmTokenService;
import com.myaicrosoft.myonitoring.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * ScheduleNotification
 * - 이상 알림 데이터를 Firebase로 전달합니다.
 */
@Component // Spring Bean으로 등록
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
@Slf4j
public class ScheduleNotification {

    private final NotificationLogRepository notificationLogRepository; // 알림 로그 저장 Repository
    private final ScheduleNotificationService scheduleNotificationService; // Firebase 알림 전송 서비스
    private final IntakeStatisticsRepository intakeStatisticsRepository;
    private final FcmTokenService fcmTokenService;
    private final NotificationService notificationService;

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
    @Scheduled(cron = "0 0 10 * * *", zone = "Asia/Seoul")
    public void checkIntakeAnomalies() {
        try {
            List<IntakeStatistics> statistics = intakeStatisticsRepository.findByChangeDaysGreaterThanEqual(2);
            log.info("섭취량 이상 데이터 조회 완료. 데이터 수: {}", statistics.size());

            statistics.forEach(stat -> {
                String catName = stat.getCat().getName();
                int changeDays = stat.getChangeDays();
                int changeStatus = stat.getChangeStatus();

                if (changeDays >= 2) {
                    Cat cat = stat.getCat();
                    String title = "섭취량 이상 감지";
                    String body = String.format("고양이 %s의 섭취량 이상이 감지되었습니다!\n" +
                                    "%d일 연속 섭취량이 %s하였으니, %s의 건강 상태를 확인해주세요.",
                            catName, changeDays, (changeStatus == -1 ? "감소" : "증가"), catName);

                    notificationService.sendNotificationWithLog(cat, title, body, NotificationCategory.INTAKE);
                }
            });
        } catch (Exception e) {
            log.error("섭취량 이상 알림 데이터 전송 중 오류 발생", e);
        }
    }
}
