package com.myaicrosoft.myonitoring.service;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.entity.Cat;
import com.myaicrosoft.myonitoring.model.entity.Intake;
import com.myaicrosoft.myonitoring.model.entity.Statistics;
import com.myaicrosoft.myonitoring.repository.CatRepository;
import com.myaicrosoft.myonitoring.repository.IntakeRepository;
import com.myaicrosoft.myonitoring.repository.StatisticsRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

/**
 * StatisticsService
 * - 매일 자정에 실행되는 스케줄링 작업을 통해 통계 데이터를 생성합니다.
 */
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
public class StatisticsService {

    private final IntakeRepository intakeRepository; // 섭취 데이터를 조회하는 Repository
    private final StatisticsRepository statisticsRepository; // 통계 데이터를 저장하는 Repository
    private final CatRepository catRepository; // 고양이 정보를 조회하는 Repository

    /**
     * 매일 자정에 실행되는 스케줄링 작업
     * - @Scheduled(cron = "0 0 0 * * *"): 매일 자정에 실행됩니다.
     */
    @Scheduled(cron = "0 0 0 * * *") // 매일 00시 실행
    public void calculateDailyStatistics() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1); // 전날 날짜 계산

        // 모든 고양이에 대해 통계 생성
        List<Cat> cats = catRepository.findAll();
        for (Cat cat : cats) {
            createStatisticsForCat(cat, yesterday);
        }
    }

    /**
     * 특정 고양이에 대한 통계를 생성하는 메서드
     *
     * @param cat      고양이 정보
     * @param statDate 통계를 생성할 날짜 (전날)
     */
    private void createStatisticsForCat(Cat cat, LocalDate statDate) {
        // 전날 섭취 데이터 조회
        List<Intake> intakes = intakeRepository.findByCatIdAndDate(cat.getId(), statDate);

        // 총 섭취량 계산
        int totalIntake = intakes.stream()
                .mapToInt(Intake::getIntakeAmount)
                .sum();

        // 최근 7일과 30일 평균 섭취량 계산
        BigDecimal avg7d = calculateAverageIntake(cat, statDate.minusDays(7), statDate.minusDays(1));
        BigDecimal avg30d = calculateAverageIntake(cat, statDate.minusDays(30), statDate.minusDays(1));

        // 증감률 계산 (0-1 범위로 저장)
        BigDecimal change7d = calculateChangeRate(totalIntake, avg7d);
        BigDecimal change30d = calculateChangeRate(totalIntake, avg30d);

        // 증감 상태 계산 (20% 이상 증가: 1 / -20% 이하 감소: -1 / 그 외: 0)
        int changeStatus = calculateChangeStatus(change30d);

        // Statistics 엔티티 생성 및 저장
        Statistics statistics = Statistics.builder()
                .cat(cat)
                .statDate(statDate)
                .totalIntake(totalIntake)
                .change7d(change7d)
                .change30d(change30d)
                .changeStatus(changeStatus)
                .build();

        statisticsRepository.save(statistics); // 통계 데이터 저장
    }

    /**
     * 평균 섭취량을 계산하는 메서드
     *
     * @param cat       고양이 정보
     * @param startDate 시작 날짜
     * @param endDate   종료 날짜
     * @return 평균 섭취량 (BigDecimal)
     */
    private BigDecimal calculateAverageIntake(Cat cat, LocalDate startDate, LocalDate endDate) {
        List<Intake> intakes = intakeRepository.findByCatIdAndDateRange(cat.getId(), startDate, endDate);

        if (intakes.isEmpty()) {
            return BigDecimal.ZERO; // 데이터가 없는 경우 0 반환
        }

        int totalAmount = intakes.stream()
                .mapToInt(Intake::getIntakeAmount)
                .sum();

        return BigDecimal.valueOf(totalAmount).divide(BigDecimal.valueOf(intakes.size()), 2, RoundingMode.HALF_UP);
    }

    /**
     * 증감률을 계산하는 메서드
     *
     * @param totalIntake 총 섭취량
     * @param averageIntake 평균 섭취량
     * @return 증감률 (BigDecimal)
     */
    private BigDecimal calculateChangeRate(int totalIntake, BigDecimal averageIntake) {
        if (averageIntake.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO; // 평균이 0인 경우 증감률도 0 반환
        }
        return BigDecimal.valueOf(totalIntake).subtract(averageIntake)
                .divide(averageIntake, 4, RoundingMode.HALF_UP);
    }

    /**
     * 증감 상태를 계산하는 메서드 (20% 이상 증가: 1 / -20% 이하 감소: -1 / 그 외: 0)
     *
     * @param change30d 최근 30일 대비 증감률 (BigDecimal)
     * @return 증감 상태 (-1, 0, 1 중 하나)
     */
    private int calculateChangeStatus(BigDecimal change30d) {
        if (change30d.compareTo(BigDecimal.valueOf(0.2)) >= 0) { // 20% 이상 증가
            return 1;
        } else if (change30d.compareTo(BigDecimal.valueOf(-0.2)) <= 0) { // -20% 이하 감소
            return -1;
        }
        return 0; // 그 외의 경우
    }
}
