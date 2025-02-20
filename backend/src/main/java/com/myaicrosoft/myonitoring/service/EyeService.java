package com.myaicrosoft.myonitoring.service;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.entity.Eye;
import com.myaicrosoft.myonitoring.repository.EyeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 안구 질환(Eye Disease) 데이터를 처리하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
public class EyeService {

    private final EyeRepository eyeRepository;

    /**
     * 특정 고양이의 특정 날짜 안구 질환 데이터를 조회하는 메서드
     *
     * @param catId 고양이 ID (Primary Key)
     * @param day   조회할 날짜
     * @return 안구 질환 데이터 또는 메시지 반환 (Map 형식)
     */
    public Object getEyeDiseaseDetails(Long catId, LocalDate day) {
        // 해당 날짜의 시작과 끝 시간 계산
        LocalDateTime startOfDay = day.atStartOfDay();
        LocalDateTime endOfDay = day.atTime(23, 59, 59);

        // isEyeDiseased가 true인 가장 최신 데이터 조회
        Optional<Eye> latestDiseasedData = eyeRepository.findTopByCatIdAndCapturedDateTimeBetweenAndIsEyeDiseasedOrderByCapturedDateTimeDesc(
                catId, startOfDay, endOfDay, true);

        // 질병 데이터가 없는 경우 메시지 반환
        if (latestDiseasedData.isEmpty()) {
            return Map.of("message", "안구 건강 의심 증상이 발견되지 않았습니다.");
        }

        // 가장 최신 데이터 가져오기
        Eye eye = latestDiseasedData.get();

        // 0.5 이상인 확률만 필터링하여 반환 데이터 생성
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("date_time", eye.getCapturedDateTime().toString());
        
        // 이미지 URL 추가
        Map<String, String> images = new LinkedHashMap<>();
        if (eye.getLeftEyeImageUrl() != null) {
            images.put("left", eye.getLeftEyeImageUrl());
        }
        if (eye.getRightEyeImageUrl() != null) {
            images.put("right", eye.getRightEyeImageUrl());
        }
        response.put("images", images);

        List<Map<String, Map<String, BigDecimal>>> filteredData = new ArrayList<>();

        addIfAboveThreshold(filteredData, "blepharitis_prob", eye.getLeftBlepharitisProb(), eye.getRightBlepharitisProb());
        addIfAboveThreshold(filteredData, "conjunctivitis_prob", eye.getLeftConjunctivitisProb(), eye.getRightConjunctivitisProb());
        addIfAboveThreshold(filteredData, "corneal_sequestrum_prob", eye.getLeftCornealSequestrumProb(), eye.getRightCornealSequestrumProb());
        addIfAboveThreshold(filteredData, "non_ulcerative_keratitis_prob", eye.getLeftNonUlcerativeKeratitisProb(), eye.getRightNonUlcerativeKeratitisProb());
        addIfAboveThreshold(filteredData, "corneal_ulcer_prob", eye.getLeftCornealUlcerProb(), eye.getRightCornealUlcerProb());

        response.put("data", filteredData);

        return response;
    }

    /**
     * 특정 확률 값이 0.5 이상인 경우 데이터를 추가하는 메서드
     *
     * @param dataList   결과 데이터를 담을 리스트
     * @param key        확률 항목 키 (예: blepharitis_prob)
     * @param leftValue  왼쪽 눈 확률 값
     * @param rightValue 오른쪽 눈 확률 값
     */
    private void addIfAboveThreshold(List<Map<String, Map<String, BigDecimal>>> dataList,
                                     String key,
                                     BigDecimal leftValue,
                                     BigDecimal rightValue) {
        if ((leftValue != null && leftValue.compareTo(BigDecimal.valueOf(0.5)) >= 0) ||
                (rightValue != null && rightValue.compareTo(BigDecimal.valueOf(0.5)) >= 0)) {
            dataList.add(Map.of(key, Map.of(
                    "left", leftValue != null ? leftValue : BigDecimal.ZERO,
                    "right", rightValue != null ? rightValue : BigDecimal.ZERO
            )));
        }
    }
}
