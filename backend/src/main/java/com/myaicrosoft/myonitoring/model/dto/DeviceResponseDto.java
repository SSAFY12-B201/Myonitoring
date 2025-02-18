package com.myaicrosoft.myonitoring.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DeviceResponseDto {
    private Long id;
    private String serialNumber;
    private LocalDate registrationDate;
    private Long catId;
    private String catName;
}
