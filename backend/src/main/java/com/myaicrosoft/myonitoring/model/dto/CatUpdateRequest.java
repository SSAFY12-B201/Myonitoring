package com.myaicrosoft.myonitoring.model.dto;

import lombok.Data;
import com.myaicrosoft.myonitoring.model.entity.Gender;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CatUpdateRequest {
    private String name; // 이름 (선택)
    private String breed; // 품종 (선택)
    private Gender gender; // 성별 (선택)
    private Boolean isNeutered; // 중성화 여부 (선택)
    private LocalDate birthDate; // 생년월일 (선택)
    private Integer age; // 나이 (선택)
    private BigDecimal weight; // 체중 (선택)
    private BigDecimal targetDailyIntake; // 권장섭취량 (선택)
    private String characteristics; // 특징 (선택)
    private String profileImageUrl; // 프로필 이미지 URL (선택)
}
