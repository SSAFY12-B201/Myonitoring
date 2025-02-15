package com.myaicrosoft.myonitoring.model.dto;

import lombok.Data;
import com.myaicrosoft.myonitoring.model.entity.Gender;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CatCreateRequest {
    private Long deviceId; // 기기 ID (필수)
    private String name; // 이름 (필수)
    private String breed; // 품종 (필수)
    private Gender gender; // 성별 (필수, Enum 사용)
    private Boolean isNeutered; // 중성화 여부 (필수)
    private LocalDate birthDate; // 생년월일 (필수)
    private Integer age; // 나이 (필수)
    private BigDecimal weight; // 체중 (필수)
    private String characteristics; // 특징 (선택)
    private String profileImageUrl; // 프로필 이미지 URL (선택)
}
