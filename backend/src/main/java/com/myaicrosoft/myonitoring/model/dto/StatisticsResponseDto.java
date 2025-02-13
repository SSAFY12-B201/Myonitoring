package com.myaicrosoft.myonitoring.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 통계 데이터 응답 DTO 클래스
 */
@Data
@AllArgsConstructor // 모든 필드를 포함한 생성자 자동 생성
public class StatisticsResponseDto {
    private BigDecimal average7d;       // 전날의 평균 섭취량 (최근 7일)
    private BigDecimal average30d;      // 전날의 평균 섭취량 (최근 30일)
    private BigDecimal change7d;        // 전날의 change7d 값
    private BigDecimal change30d;       // 전날의 change30d 값
    private int totalIntake;            // 전날의 totalIntake
    private int changeDays;             // 연속된 날짜 수 (2 이상인 경우만 반환)
    private int changeStatus;           // 증감 상태 (-1, 0, 1 중 하나)
}
