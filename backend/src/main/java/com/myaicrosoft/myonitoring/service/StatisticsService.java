package com.myaicrosoft.myonitoring.service;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.dto.StatisticsResponseDto;
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
     */
    @Scheduled(cron = "0 21 11 * * *")
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

        // 섭취 데이터가 없는 경우 저장하지 않음
        if (intakes.isEmpty()) {
            System.out.println("섭취 데이터가 없어 통계 데이터를 생성하지 않습니다. 고양이 ID: " + cat.getId() + ", 날짜: " + statDate);
            return; // 메서드 종료
        }

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

        // changeDays 계산 로직 추가
        int changeDays = calculateChangeDays(cat.getId(), statDate, changeStatus);

        // Statistics 엔티티 생성 및 저장
        Statistics statistics = Statistics.builder()
                .cat(cat)
                .statDate(statDate)
                .totalIntake(totalIntake)
                .change7d(change7d)
                .change30d(change30d)
                .average7d(avg7d) // 평균 섭취량 (최근 7일) 저장
                .average30d(avg30d) // 평균 섭취량 (최근 30일) 저장
                .changeStatus(changeStatus)
                .changeDays(changeDays) // changedays 추가
                .build();

        statisticsRepository.save(statistics); // 통계 데이터 저장
    }

    /**
     * 특정 고양이의 통계 데이터를 조회하는 로직 (API용)
     *
     * @param catId 고양이 ID (Primary Key)
     * @param day   기준 날짜 (YYYY-MM-DD)
     * @return 통계 데이터 응답 DTO 반환
     */
    public StatisticsResponseDto getStatistics(Long catId, LocalDate day) {
        // 기준 날짜의 전날 데이터 조회 (yesterday)
        LocalDate yesterday = day.minusDays(1);
        Statistics yesterdayStat = statisticsRepository.findByCatIdAndStatDate(catId, yesterday)
                .orElseThrow(() -> new IllegalArgumentException("해당 날짜의 통계 데이터를 찾을 수 없습니다. 날짜: " + yesterday));

        // change_days와 change_status 처리 로직 추가
        int changeDays = yesterdayStat.getChangeDays();
        int changeStatus = yesterdayStat.getChangeStatus();
        if (changeDays <= 1) {
            changeDays = 0; // change_days가 1 이하인 경우 0으로 설정
            changeStatus = 0; // change_status도 0으로 설정
        }

        // 응답 DTO 생성 및 반환
        return new StatisticsResponseDto(
                yesterdayStat.getAverage7d(),
                yesterdayStat.getAverage30d(),
                yesterdayStat.getChange7d(),
                yesterdayStat.getChange30d(),
                yesterdayStat.getTotalIntake(), // totalIntake는 그대로 사용하지만 이름을 변경하여 응답에 포함해야 함.
                changeDays,
                changeStatus
        );
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
        // StatisticsRepository 인스턴스를 통해 메서드 호출
        List<Statistics> totalIntakes = statisticsRepository.findByCatIdAndStatDateRangeForAverage(cat.getId(), startDate, endDate);

        if (totalIntakes.isEmpty()) {
            return BigDecimal.ZERO; // 데이터가 없는 경우 0 반환
        }

        // 총 섭취량 계산
        int totalAmount = totalIntakes.stream()
                .mapToInt(Statistics::getTotalIntake) // 하루 총 섭취량 가져오기
                .sum();

        System.out.println("디버깅 totalIntakes 리스트:");
        totalIntakes.forEach(totalIntake ->
                System.out.println(" - 날짜: " + totalIntake.getStatDate() + ", 섭취량: " + totalIntake.getTotalIntake())
        );
        System.out.println("디버깅 값 확인:" + BigDecimal.valueOf(totalAmount).divide(BigDecimal.valueOf(totalIntakes.size()), 2, RoundingMode.HALF_UP));

        // 평균 계산 및 반환 (소수점 둘째 자리까지 반올림)
        return BigDecimal.valueOf(totalAmount).divide(BigDecimal.valueOf(totalIntakes.size()), 2, RoundingMode.HALF_UP);
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

    /**
     * changeDays를 계산하는 메서드.
     *
     * @param catId         고양이 ID.
     * @param statDate      현재 날짜.
     * @param changeStatus  현재 changeStatus 값.
     * @return changeDays 값.
     */
    private int calculateChangeDays(Long catId, LocalDate statDate, int changeStatus) {
        if (changeStatus == 0) {
            return 0; // 현재 changeStatus가 0이면 changedays는 무조건 0.
        }

        // 전날 데이터 조회
        LocalDate yesterday = statDate.minusDays(1);
        Statistics yesterdayStat = statisticsRepository.findByCatIdAndStatDate(catId, yesterday).orElse(null);

        if (yesterdayStat == null || yesterdayStat.getChangeStatus() != changeStatus) {
            return 1; // 전날 데이터가 없거나 다른 상태인 경우 changedays는 1로 초기화.
        }

        return yesterdayStat.getChangeDays() + 1; // 전날의 changedays + 1 반환.
    }
}
