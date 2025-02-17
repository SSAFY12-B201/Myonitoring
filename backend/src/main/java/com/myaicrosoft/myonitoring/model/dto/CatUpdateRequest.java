package com.myaicrosoft.myonitoring.model.dto;

import com.myaicrosoft.myonitoring.model.entity.Gender;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 고양이 정보 수정 요청 DTO 클래스
 */
@Data
public class CatUpdateRequest {
    private String name; // 필수 필드: 이름
    private String breed; // 필수 필드: 품종
    private Gender gender; // 필수 필드: 성별
    private Boolean isNeutered; // 필수 필드: 중성화 여부
    private LocalDate birthDate; // 필수 필드: 생년월일
    private Integer age; // 필수 필드: 나이
    private BigDecimal weight; // 필수 필드: 체중
    private String characteristics; // 선택 필드: 특징
    private String profileImageUrl; // 선택 필드: 프로필 이미지 URL
}
