package com.myaicrosoft.myonitoring.model.dto;

import com.myaicrosoft.myonitoring.model.entity.MedicalCategory;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 의료 기록 생성 및 수정 요청 DTO 클래스
 */
@Data
public class MedicalRequest {
    private MedicalCategory category; // 필수 필드: 카테고리(CHECKUP, TREATMENT 등)
    private String title;             // 필수 필드: 제목(100자 이내)
    private String description;       // 선택 필드: 설명(TEXT 타입)
    private String hospitalName;      // 필수 필드: 병원 이름(100자 이내)
    private LocalDate visitDate;      // 필수 필드: 방문 날짜(YYYY-MM-DD 형식)
    private LocalTime visitTime;      // 필수 필드: 방문 시간(HH:mm:ss 형식)
}
