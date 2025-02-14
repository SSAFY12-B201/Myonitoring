package com.myaicrosoft.myonitoring.model.dto;

import com.myaicrosoft.myonitoring.model.entity.MedicalCategory;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 특정 기간의 의료 기록 응답 DTO 클래스
 */
@Data
@AllArgsConstructor
public class MedicalResponseDto {
    private Long id;
    private MedicalCategory category; // 카테고리(CHECKUP, TREATMENT 등)
    private String title;             // 제목(100자 이내)
    private LocalDate visitDate;      // 방문 날짜(YYYY-MM-DD 형식)
    private LocalTime visitTime;      // 방문 시간(HH:mm:ss 형식)
}
