package com.myaicrosoft.myonitoring.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationRequestDto {
    private String token;
    private String title;
    private String body;
}
