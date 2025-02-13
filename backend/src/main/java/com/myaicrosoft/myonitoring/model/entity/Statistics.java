package com.myaicrosoft.myonitoring.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "stat_records") // 테이블 이름 지정
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Statistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_id", nullable = false) // 외래 키 이름 지정
    private Cat cat;

    @Column(nullable = false)
    private LocalDate statDate;

    // 일간 총 섭취량
    @Column(nullable = false)
    private Integer totalIntake;

    // 최근 7일의 평균 섭취량
    @Column(precision = 6, scale = 2, nullable = false)
    private BigDecimal average7d;

    // 최근 30일의 평균 섭취량
    @Column(precision = 6, scale = 2, nullable = false)
    private BigDecimal average30d;

    // 최근 7일 대비 증감률
    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal change7d;

    // 최근 30일 대비 증감률
    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal change30d;

    // 최근 30일 대비 증감률을 기준으로
    // 20% 이상 증가: 1 / 20% 이상 감소: -1 / 그 외: 0
    @Column(nullable = false)
    private Integer changeStatus;

    // 1 또는 -1이 연속된 날짜 수
    @Column(nullable = false)
    private Integer changeDays;
}
