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
     * @param catId     고양이 ID (Primary Key)
     * @param weekStart 주간 시작 날짜
     * @return 요일별 누적 데이터 (섭취량 및 급여량 포함)
     */
    public Map<String, Map<String, Integer>> getWeeklyCumulativeData(Long catId, LocalDate weekStart) {
        LocalDateTime startOfWeek = weekStart.atStartOfDay();
        LocalDateTime endOfWeek = weekStart.plusDays(6).atTime(LocalTime.MAX);

        // 해당 주의 섭취 데이터와 급여 데이터 조회
        List<Intake> intakes = intakeRepository.findByCatIdAndIntakeDateTimeBetween(catId, startOfWeek, endOfWeek);
        List<Feeding> feedings = feedingRepository.findByCatIdAndWeek(catId, startOfWeek, endOfWeek);

        // 결과 데이터를 담을 맵 초기화 (요일별 자동 정렬)
        Map<String, Map<String, Integer>> weeklyData = new TreeMap<>();

        for (int i = 0; i < 7; i++) {
            String day = weekStart.plusDays(i).toString();
            weeklyData.put(day, new HashMap<>());
            weeklyData.get(day).put("intake", 0);
            weeklyData.get(day).put("feeding", 0);
        }

        // 섭취 데이터 합산
        for (Intake intake : intakes) {
            String day = intake.getIntakeDateTime().toLocalDate().toString();
            weeklyData.get(day).put("intake", weeklyData.get(day).get("intake") + intake.getIntakeAmount());
        }

        // 급여 데이터 합산
        for (Feeding feeding : feedings) {
            String day = feeding.getFeedingDateTime().toLocalDate().toString();
            weeklyData.get(day).put("feeding", weeklyData.get(day).get("feeding") + feeding.getConfiguredFeedingAmount());
        }

        return weeklyData;
    }

    /**
     * 일간 급여 및 섭취 상세 데이터를 반환하는 메서드
     *
     * @param catId 고양이 ID (Primary Key)
     * @param day   조회할 날짜
     * @return 급여 및 섭취 상세 데이터 리스트 (List 형식)
     */
    public List<Map<String, Object>> getDailyFeedingAndIntakeDetails(Long catId, LocalDate day) {
        // 오늘의 시작 시간과 종료 시간
        LocalDateTime startOfDay = day.atStartOfDay();
        LocalDateTime endOfDay = day.atTime(LocalTime.MAX);

        // 내일의 시작 시간과 종료 시간
        LocalDate tomorrow = day.plusDays(1);
        LocalDateTime startOfTomorrow = tomorrow.atStartOfDay();
        LocalDateTime endOfTomorrow = tomorrow.atTime(LocalTime.MAX);

        // 오늘과 내일의 Feeding 데이터 조회
        List<Feeding> todayFeedings = feedingRepository.findByCatIdAndFeedingDateTimeBetween(catId, startOfDay, endOfDay);
        List<Feeding> tomorrowFeedings = feedingRepository.findByCatIdAndFeedingDateTimeBetween(catId, startOfTomorrow, endOfTomorrow);

        // Intake 데이터 조회 (오늘의 첫 Feeding부터 내일의 첫 Feeding까지)
        LocalDateTime firstFeedingTimeToday = todayFeedings.isEmpty() ? startOfDay : todayFeedings.get(0).getFeedingDateTime();
        LocalDateTime firstFeedingTimeTomorrow = tomorrowFeedings.isEmpty() ? endOfDay : tomorrowFeedings.get(0).getFeedingDateTime();

        List<Intake> intakes = intakeRepository.findByCatIdAndIntakeDateTimeBetween(catId, firstFeedingTimeToday, firstFeedingTimeTomorrow);

        // 결과 데이터를 담을 리스트 초기화
        List<Map<String, Object>> result = new ArrayList<>();

        for (int i = 0; i < todayFeedings.size(); i++) {
            Feeding currentFeeding = todayFeedings.get(i);
            LocalDateTime feedingTime = currentFeeding.getFeedingDateTime();

            // 다음 Feeding 찾기
            LocalDateTime nextFeedingTime;
            if (i + 1 < todayFeedings.size()) {
                nextFeedingTime = todayFeedings.get(i + 1).getFeedingDateTime();
            } else {
                // 마지막 Feeding이면 내일 첫 Feeding 시간 또는 하루의 끝으로 설정
                nextFeedingTime = tomorrowFeedings.isEmpty() ? endOfDay : tomorrowFeedings.get(0).getFeedingDateTime();
            }

            // Feeding 데이터 객체 생성
            Map<String, Object> feedingData = new LinkedHashMap<>();
            feedingData.put("time", feedingTime.toLocalTime().toString());
            feedingData.put("amount", currentFeeding.getConfiguredFeedingAmount());

            // Feeding 시간에 해당하는 Intake 데이터 필터링 및 누적 계산
            List<Map<String, Object>> intakeDetails = new ArrayList<>();
            int cumulativeAmount = 0;

            for (Intake intake : intakes) {
                // Feeding 시간 이후이며, 다음 Feeding 시간 이전인 Intake만 포함
                if (!intake.getIntakeDateTime().isBefore(feedingTime) &&
                        !intake.getIntakeDateTime().isAfter(nextFeedingTime)) {

                    cumulativeAmount += intake.getIntakeAmount();

                    Map<String, Object> intakeData = new LinkedHashMap<>();
                    intakeData.put("start_time", intake.getIntakeDateTime().toLocalTime().toString());
                    intakeData.put("end_time", intake.getIntakeDateTime().toLocalTime().plusMinutes(intake.getIntakeDuration()).toString());
                    intakeData.put("cumulative_amount", cumulativeAmount);
                    intakeDetails.add(intakeData);
                }
            }

            // Feeding과 Intake 데이터를 하나의 객체로 묶어서 저장
            Map<String, Object> feedingAndIntake = new LinkedHashMap<>();
            feedingAndIntake.put("feeding", feedingData);
            feedingAndIntake.put("intake", intakeDetails);

            result.add(feedingAndIntake);
        }

        return result;
    }
}
