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
    @Transactional
    @Scheduled(cron = "0 0 10 * * *", zone = "Asia/Seoul") // 매일 오전 10시 (KST)
    public void sendIntakeAlertsToFirebase() {
        LocalDate yesterday = LocalDate.now().minusDays(1); // 어제 날짜 계산

        try {
            // 어제 날짜의 모든 Statistics 데이터 조회
            List<Statistics> statisticsList = statisticsRepository.findAllByStatDate(yesterday);

            // 유저별로 그룹화하여 데이터를 전송
            statisticsList.forEach(statistics -> {
                String catName = statistics.getCat().getName(); // 고양이 이름 가져오기
                int changeStatus = statistics.getChangeStatus();
                int changeDays = statistics.getChangeDays();

                if (changeDays > 1) { // changeDays가 2 이상인 경우만 알림 전송
                    Cat cat = statistics.getCat();
                    String title = "섭취량 이상 감지";
                    String body = String.format("고양이 %s의 섭취량 이상이 감지되었습니다!\n" +
                                    "%d일 연속 섭취량이 %s하였으니, %s의 건강 상태를 확인해주세요.",
                            catName, changeDays, (changeStatus == -1 ? "감소" : "증가"), catName);

                    log.info("파이어베이스로 전송되는 데이터:");
                    log.info("제목: {}", title);
                    log.info("내용: {}", body);

                    // Firebase로 알림 전송
                    scheduleNotificationService.sendNotification(cat.getDevice().getUser().getId(), title, body);

                    // NotificationLog 엔티티에 데이터 저장
                    NotificationLog notificationLog = NotificationLog.builder()
                            .cat(cat)
                            .notificationDateTime(LocalDateTime.now())
                            .category(NotificationCategory.INTAKE)
                            .message(body)
                            .build();
                    notificationLogRepository.save(notificationLog);

                    log.info("Firebase로 섭취량 이상 알림 전송 및 로그 저장 완료 (고양이: {}, 유저 ID: {})",
                            catName, cat.getDevice().getUser().getId());
                } else {
                    log.info("섭취량 이상 데이터가 없어 알림이 전송되지 않았습니다 (고양이: {}).", catName);
                }
            });
        } catch (Exception e) {
            log.error("섭취량 이상 알림 데이터 전송 중 오류 발생", e);
        }
    }
}
