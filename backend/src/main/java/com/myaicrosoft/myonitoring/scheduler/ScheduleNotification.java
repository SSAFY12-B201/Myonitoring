package com.myaicrosoft.myonitoring.scheduler;

import com.myaicrosoft.myonitoring.model.entity.Statistics;
import com.myaicrosoft.myonitoring.repository.StatisticsRepository;
import com.myaicrosoft.myonitoring.service.ScheduleNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * ScheduleNotification
 * - 매일 오전 10시에 섭취량 이상 알림 데이터를 Firebase로 전달합니다.
 */
@Component // Spring Bean으로 등록
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
@Slf4j
public class ScheduleNotification {

    private final StatisticsRepository statisticsRepository; // Statistics 데이터를 조회하는 Repository
    private final ScheduleNotificationService scheduleNotificationService; // Firebase 알림 전송 서비스

    /**
     * 매일 오전 10시에 실행되는 스케줄링 작업
     */
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul") // 매일 오전 10시 (KST)
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
                double change30d = statistics.getChange30d().doubleValue();

                if (changeDays > 1) { // changeDays가 2 이상인 경우만 알림 전송
                    String title = "섭취량 이상 감지";
                    String body = String.format("고양이 '%s'의 섭취량 이상 감지됨! 상태: %d, 연속 일수: %d, 변화율: %.2f%%",
                            catName, changeStatus, changeDays, change30d * 100);

                    // Firebase로 알림 전송 (인스턴스를 통해 호출)
                    scheduleNotificationService.sendNotification(statistics.getCat().getDevice().getUser().getId(), title, body);
                    log.info("Firebase로 섭취량 이상 알림 전송 완료 (고양이: {}, 유저 ID: {})", catName, statistics.getCat().getDevice().getUser().getId());
                } else {
                    log.info("섭취량 이상 데이터가 없어 알림이 전송되지 않았습니다 (고양이: {}).", catName);
                }
            });
        } catch (Exception e) {
            log.error("섭취량 이상 알림 데이터 전송 중 오류 발생", e);
        }
    }
}
