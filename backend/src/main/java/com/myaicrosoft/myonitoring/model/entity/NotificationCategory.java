package com.myaicrosoft.myonitoring.model.entity;

public enum NotificationCategory {
    INTAKE("섭취량 이상"),
    EYE("눈 건강 이상"),
    DEVICE("기기 이상"),
    FOOD("사료 배급량 이상");

    private final String description;

    NotificationCategory(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}