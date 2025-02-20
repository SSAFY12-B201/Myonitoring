package com.myaicrosoft.myonitoring.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 기기 생성 응답 DTO 클래스
 */
@Data
@AllArgsConstructor
public class DeviceCreateResponse {
    private Long id;           // 기기 ID
    private String serialNumber; // 기기 시리얼 번호
    private Long userId;       // 유저 ID
    private Long catId;        // 고양이 ID
}
