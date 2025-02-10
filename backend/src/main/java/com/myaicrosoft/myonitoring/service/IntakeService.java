package com.myaicrosoft.myonitoring.service;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.entity.Feeding;
import com.myaicrosoft.myonitoring.model.entity.Intake;
import com.myaicrosoft.myonitoring.repository.FeedingRepository;
import com.myaicrosoft.myonitoring.repository.IntakeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

/**
 * 섭취(Intake) 및 급여(Feeding) 데이터를 처리하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
public class IntakeService {

    private final IntakeRepository intakeRepository;
    private final FeedingRepository feedingRepository;

    /**
     * 일간 누적 섭취량을 계산하는 메서드
     *
     * @param catId 고양이 ID (Primary Key)
     * @param date  조회할 날짜
     * @return 누적 섭취량 (BigDecimal)
     */
    public BigDecimal getDailyCumulativeIntake(Long catId, LocalDate date) {
        // 해당 날짜의 시작과 끝 시간 계산
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // 섭취 데이터 조회
        List<Intake> intakes = intakeRepository.findByCatIdAndIntakeDateTimeBetween(catId, startOfDay, endOfDay);

        // 섭취량 합산
        return intakes.stream()
                .map(intake -> BigDecimal.valueOf(intake.getIntakeAmount())) // Integer → BigDecimal 변환
                .reduce(BigDecimal.ZERO, BigDecimal::add); // BigDecimal 합산
    }

    /**
     * 주간 누적 섭취량 및 급여량 데이터를 계산하는 메서드
     *
     * @param catId       고양이 ID (Primary Key)
     * @param weekStart   주간 시작 날짜
     * @return 요일별 누적 데이터 (섭취량 및 급여량 포함)
     */
    public Map<String, Map<String, Integer>> getWeeklyCumulativeData(Long catId, LocalDate weekStart) {
        // 주간 시작일과 종료일 계산
        LocalDateTime startOfWeek = weekStart.atStartOfDay();
        LocalDateTime endOfWeek = weekStart.plusDays(6).atTime(LocalTime.MAX);

        // 해당 주의 섭취 데이터와 급여 데이터 조회
        List<Intake> intakes = intakeRepository.findByCatIdAndIntakeDateTimeBetween(catId, startOfWeek, endOfWeek);
        List<Feeding> feedings = feedingRepository.findByCatIdAndWeek(catId, startOfWeek, endOfWeek);

        // 결과 데이터를 담을 맵 초기화 (요일별로 초기값 설정)
        Map<String, Map<String, Integer>> weeklyData = new HashMap<>();
        for (int i = 0; i < 7; i++) {
            String day = weekStart.plusDays(i).toString();
            weeklyData.put(day, new HashMap<>());
            weeklyData.get(day).put("intake", 0);
            weeklyData.get(day).put("feeding", 0);
        }

        // 섭취 데이터 합산
        for (Intake intake : intakes) {
            String day = intake.getIntakeDateTime().toLocalDate().toString();
            int amount = intake.getIntakeAmount();
            weeklyData.get(day).put("intake", weeklyData.get(day).get("intake") + amount);
        }

        // 급여 데이터 합산 (configuredFeedingAmount 기준으로 변경)
        for (Feeding feeding : feedings) {
            String day = feeding.getFeedingDateTime().toLocalDate().toString();
            int amount = feeding.getConfiguredFeedingAmount();
            weeklyData.get(day).put("feeding", weeklyData.get(day).get("feeding") + amount);
        }

        return sortByKey(weeklyData); // 날짜 기준으로 정렬된 결과 반환
    }

    /**
     * Map을 키(날짜) 기준으로 정렬하는 메서드
     *
     * @param map 정렬할 Map 객체
     * @return 키(날짜) 기준으로 정렬된 Map 객체
     */
    private Map<String, Map<String, Integer>> sortByKey(Map<String, Map<String, Integer>> map) {
        return new TreeMap<>(map); // TreeMap을 사용하여 키(날짜) 기준으로 자동 정렬
    }

    /**
     * 일간 급여 및 섭취 상세 데이터를 반환하는 메서드
     *
     * @param catId 고양이 ID (Primary Key)
     * @param day   조회할 날짜
     * @return 급여 및 섭취 상세 데이터 리스트 (List 형식)
     */
    public List<Map<String, Object>> getDailyFeedingAndIntakeDetails(Long catId, LocalDate day) {
        // 해당 날짜의 시작과 끝 시간 계산
        LocalDateTime startOfDay = day.atStartOfDay();
        LocalDateTime endOfDay = day.atTime(LocalTime.MAX);

        // Feeding 데이터 조회
        List<Feeding> feedings = feedingRepository.findByCatIdAndFeedingDateTimeBetween(catId, startOfDay, endOfDay);

        // Intake 데이터 조회
        List<Intake> intakes = intakeRepository.findByCatIdAndIntakeDateTimeBetween(catId, startOfDay, endOfDay);

        // 결과 데이터를 담을 리스트 초기화
        List<Map<String, Object>> result = new ArrayList<>();

        for (Feeding feeding : feedings) {
            // Feeding 데이터 추가
            Map<String, Object> feedingData = new LinkedHashMap<>();
            feedingData.put("type", "feeding");
            feedingData.put("data", Map.of(
                    "time", feeding.getFeedingDateTime().toLocalTime().toString(),
                    "amount", feeding.getConfiguredFeedingAmount()
            ));
            result.add(feedingData);

            // Feeding 시간에 해당하는 Intake 데이터 필터링 및 누적 계산
            List<Map<String, Object>> intakeDetails = new ArrayList<>();
            int cumulativeAmount = 0;

            for (Intake intake : intakes) {
                if (intake.getIntakeDateTime().isAfter(feeding.getFeedingDateTime()) &&
                        intake.getIntakeDateTime().isBefore(feeding.getFeedingDateTime().plusHours(6))) { // 6시간 기준으로 그룹화
                    cumulativeAmount += intake.getIntakeAmount();
                    Map<String, Object> intakeData = new LinkedHashMap<>();
                    intakeData.put("start_time", intake.getIntakeDateTime().toLocalTime().toString());
                    intakeData.put("end_time", intake.getIntakeDateTime().toLocalTime().plusMinutes(intake.getIntakeDuration()).toString());
                    intakeData.put("cumulative_amount", cumulativeAmount);
                    intakeDetails.add(intakeData);
                }
            }

            // Intake 데이터를 Feeding 뒤에 추가
            if (!intakeDetails.isEmpty()) {
                Map<String, Object> intakeDataWrapper = new LinkedHashMap<>();
                intakeDataWrapper.put("type", "intake");
                intakeDataWrapper.put("data", intakeDetails);
                result.add(intakeDataWrapper);
            }
        }

        return result;
    }
}
