package com.myaicrosoft.myonitoring.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DataCollectionRequest {
    @JsonProperty("serial_number")
    private String serialNumber; // 기기의 시리얼 넘버

    private LocalDateTime datetime; // 데이터 발생 시간

    private String type; // 데이터 타입 (feeding, intake, eye)

    private Payload data; // 타입별 데이터

    @Data
    public static class Payload {
        @JsonProperty("configured_amount")
        private Integer configuredAmount; // Feeding 관련 필드

        @JsonProperty("actual_amount")
        private Integer actualAmount; // Feeding 관련 필드

        private Integer amount; // Intake 관련 필드
        private Integer duration; // Intake 관련 필드
        private List<EyeInfo> eyes; // Eye 관련 필드

        @Data
        public static class EyeInfo {
            @JsonProperty("eye_side")
            private String eyeSide; // "right" 또는 "left"

            @JsonProperty("blepharitis_prob")
            private BigDecimal blepharitisProb;

            @JsonProperty("conjunctivitis_prob")
            private BigDecimal conjunctivitisProb;

            @JsonProperty("corneal_sequestrum_prob")
            private BigDecimal cornealSequestrumProb;

            @JsonProperty("non_ulcerative_keratitis_prob")
            private BigDecimal nonUlcerativeKeratitisProb;

            @JsonProperty("corneal_ulcer_prob")
            private BigDecimal cornealUlcerProb;

            @JsonProperty("image_url")
            private String imageUrl;
        }
    }
}
