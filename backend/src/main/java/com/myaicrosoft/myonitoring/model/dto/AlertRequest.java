package com.myaicrosoft.myonitoring.model.dto;

import lombok.Data;

@Data
public class AlertRequest {
    private String type; // "FOOD" 또는 "EYE"
    private String message;
    private double value;
} 