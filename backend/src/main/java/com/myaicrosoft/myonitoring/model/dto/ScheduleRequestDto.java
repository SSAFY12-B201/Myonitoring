package com.myaicrosoft.myonitoring.model.dto;

import lombok.Data;

import java.time.LocalTime;

/**
 * 예약 스케줄 생성 및 수정 요청 DTO 클래스
 */
@Data
public class ScheduleRequestDto {
    private LocalTime scheduledTime; // 필수 필드: 예약된 급여 시간(HH:mm:ss 형식)
    private Integer scheduledAmount; // 필수 필드: 예약된 급여량(그램 단위)
}
