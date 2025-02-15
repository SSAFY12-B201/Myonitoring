package com.myaicrosoft.myonitoring.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import com.myaicrosoft.myonitoring.model.entity.Gender;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class CatDetailResponseDto {
    private Long id;
    private String name;
    private String breed;
    private Gender gender;
    private Boolean isNeutered;
    private LocalDate birthDate;
    private Integer age;
    private BigDecimal weight;
    private String characteristics; // 선택 값
    private String profileImageUrl; // 선택 값
}
