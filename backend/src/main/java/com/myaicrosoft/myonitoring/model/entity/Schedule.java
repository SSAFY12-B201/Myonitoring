package com.myaicrosoft.myonitoring.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

/**
 * 급여 스케줄(Schedule) 엔티티 클래스
 */
@Entity
@Table(name = "schedules") // 테이블 이름 지정
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false) // 외래 키 이름 지정
    private Device device;

    // 예약된 급여 시간 (반복적인 시간 설정)
    @Column(nullable = false)
    private LocalTime scheduledTime;

    // 예약된 급여량 (그램 단위)
    @Column(nullable = false)
    private Integer scheduledAmount;

    // 예약 스케줄 활성화 여부 (기본값: true)
    @Column(nullable = false)
    private Boolean isActive = true;
}
