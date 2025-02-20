package com.myaicrosoft.myonitoring.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

/**
 * 예약 스케줄 조회 응답 DTO 클래스
 */
@Data
@AllArgsConstructor // 모든 필드를 포함한 생성자 자동 생성
public class ScheduleResponseDto {
    private Long id;
    private LocalTime time;       // 급여 시간(HH:mm:ss 형식)
    private Integer amount;       // 급여량(그램 단위)
    private Boolean isActive;      // 활성화 여부(true/false)
}
