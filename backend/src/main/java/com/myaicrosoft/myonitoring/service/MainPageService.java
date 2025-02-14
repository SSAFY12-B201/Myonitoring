package com.myaicrosoft.myonitoring.service;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.entity.*;
import com.myaicrosoft.myonitoring.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

/**
 * 메인 페이지 데이터를 처리하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
public class MainPageService {

    private final IntakeRepository intakeRepository;
    private final StatisticsRepository statisticsRepository;
    private final EyeRepository eyeRepository;
    private final MedicalRepository medicalRepository;

    /**
     * 메인 페이지 데이터를 조회하는 메서드
     *
     * @param catId 고양이 ID (Primary Key)
     * @param day   조회할 날짜 (YYYY-MM-DD)
     * @return 메인 페이지에 필요한 데이터 (JSON 형식)
     */
    public Map<String, Object> getMainPageData(Long catId, LocalDate day) {
        Map<String, Object> response = new HashMap<>();

        // 1. 총 섭취량 데이터 조회
        int totalIntake = intakeRepository.findByCatIdAndIntakeDateTimeBetween(
                        catId, day.atStartOfDay(), day.atTime(23, 59, 59))
                .stream()
                .mapToInt(Intake::getIntakeAmount)
                .sum();
        response.put("total_intake", totalIntake);

        // 2. 섭취량 이상 데이터 조회
        int intakeAlertFlag = calculateIntakeAlertFlag(catId, day);
        response.put("intake_alert", Map.of("flag", intakeAlertFlag));

        // 3. 안구 질환 이상 데이터 조회
        Optional<Eye> latestEyeDisease = eyeRepository.findTopByCatIdAndCapturedDateTimeBetweenAndIsEyeDiseasedOrderByCapturedDateTimeDesc(
                catId, day.atStartOfDay(), day.atTime(23, 59, 59), true);
        Map<String, Object> eyeAlert = new HashMap<>();
        if (latestEyeDisease.isPresent()) {
            Eye eye = latestEyeDisease.get();
            Set<String> diseases = new HashSet<>(); // 중복 제거를 위한 Set 사용

            // 오른쪽 눈 질환 확인
            if (eye.getRightBlepharitisProb().compareTo(BigDecimal.valueOf(0.5)) >= 0) {
                diseases.add("blepharitis");
            }
            if (eye.getRightConjunctivitisProb().compareTo(BigDecimal.valueOf(0.5)) >= 0) {
                diseases.add("conjunctivitis");
            }
            if (eye.getRightCornealSequestrumProb().compareTo(BigDecimal.valueOf(0.5)) >= 0) {
                diseases.add("corneal_sequestrum");
            }
            if (eye.getRightNonUlcerativeKeratitisProb().compareTo(BigDecimal.valueOf(0.5)) >= 0) {
                diseases.add("non_ulcerative_keratitis");
            }
            if (eye.getRightCornealUlcerProb().compareTo(BigDecimal.valueOf(0.5)) >= 0) {
                diseases.add("corneal_ulcer");
            }

            // 왼쪽 눈 질환 확인
            if (eye.getLeftBlepharitisProb().compareTo(BigDecimal.valueOf(0.5)) >= 0) {
                diseases.add("blepharitis");
            }
            if (eye.getLeftConjunctivitisProb().compareTo(BigDecimal.valueOf(0.5)) >= 0) {
                diseases.add("conjunctivitis");
            }
            if (eye.getLeftCornealSequestrumProb().compareTo(BigDecimal.valueOf(0.5)) >= 0) {
                diseases.add("corneal_sequestrum");
            }
            if (eye.getLeftNonUlcerativeKeratitisProb().compareTo(BigDecimal.valueOf(0.5)) >= 0) {
                diseases.add("non_ulcerative_keratitis");
            }
            if (eye.getLeftCornealUlcerProb().compareTo(BigDecimal.valueOf(0.5)) >= 0) {
                diseases.add("corneal_ulcer");
            }

            eyeAlert.put("flag", 1);
            eyeAlert.put("data", new ArrayList<>(diseases)); // Set을 List로 변환하여 응답에 포함
        } else {
            eyeAlert.put("flag", 0);
        }
        response.put("eye_alert", eyeAlert);

        // 4. 의료 기록 데이터 조회
        List<Medical> medicalRecords = medicalRepository.findByCatIdAndVisitDateOrderByVisitTimeDesc(catId, day);
        Map<String, Object> medicalData = new HashMap<>();
        if (!medicalRecords.isEmpty()) {
            Set<String> categories = new HashSet<>(); // 중복을 제거하기 위해 Set 사용

            // 모든 의료 기록의 category를 Set에 추가
            for (Medical medical : medicalRecords) {
                categories.add(medical.getCategory().name().toLowerCase());
            }

            medicalData.put("flag", 1);
            medicalData.put("data", new ArrayList<>(categories)); // Set을 List로 변환하여 반환
        } else {
            medicalData.put("flag", 0);
        }
        response.put("medical", medicalData);

        return response;
    }

    /**
     * 섭취량 이상 알림 플래그를 계산하는 메서드
     *
     * @param catId 고양이 ID (Primary Key)
     * @param day   기준 날짜 (YYYY-MM-DD)
     * @return 플래그 값 (-1, 0, 1 중 하나)
     */
    private int calculateIntakeAlertFlag(Long catId, LocalDate day) {
        // 기준 날짜 포함하지 않고 이전 최대 2일간 데이터 조회
        List<Statistics> stats = statisticsRepository.findByCatIdAndStatDateRange(catId, day.minusDays(2), day.minusDays(1));

        if (stats.size() < 2) {
            return 0; // 데이터가 부족하면 플래그를 0으로 설정
        }

        // change_status 값 추출
        int[] changeStatuses = stats.stream()
                .mapToInt(Statistics::getChangeStatus)
                .toArray();

        // 연속성 확인: change_status가 두 날 모두 동일한 값인지 확인
        boolean isBothPositive = changeStatuses[0] == 1 && changeStatuses[1] == 1;
        boolean isBothNegative = changeStatuses[0] == -1 && changeStatuses[1] == -1;

        if (isBothPositive) {
            return 1; // 두 날 모두 증가한 경우
        } else if (isBothNegative) {
            return -1; // 두 날 모두 감소한 경우
        } else {
            return 0; // 그 외의 경우
        }
    }
}