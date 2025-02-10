package com.myaicrosoft.myonitoring.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CatResponseDto {
    private Long id;
    private String name;
    private String profileImageUrl;
}
