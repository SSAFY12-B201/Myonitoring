package com.myaicrosoft.myonitoring.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class DeviceDetailResponseDto {
    private Long id; // 기기 ID
    private LocalDate registrationDate; // 등록 날짜
    private String serialNumber; // 시리얼 넘버

    private CatInfo cat; // 기기에 등록된 고양이 정보
    private List<UserInfo> users; // 기기를 등록한 유저 정보

    @Data
    @AllArgsConstructor
    public static class CatInfo {
        private Long id; // 고양이 ID
        private String name; // 고양이 이름
    }

    @Data
    @AllArgsConstructor
    public static class UserInfo {
        private Long id; // 유저 ID
        private String username; // 유저 이름
    }
}
