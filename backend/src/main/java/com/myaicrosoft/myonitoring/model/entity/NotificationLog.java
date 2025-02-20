package com.myaicrosoft.myonitoring.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_records") // 테이블 이름 지정
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_id")
    private Cat cat;

    @Column(name = "notification_date", nullable = false)  // DB 컬럼명과 정확히 일치
    private LocalDateTime notificationDateTime;

    // device(배급 이상), intake(섭취량 이상), eye(눈 건강 이상)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationCategory category;

    @Column(nullable = false, length = 500)
    private String message;

    @Builder
    public NotificationLog(Cat cat, LocalDateTime notificationDateTime, NotificationCategory category, String message) {
        this.cat = cat;
        this.notificationDateTime = notificationDateTime;
        this.category = category;
        this.message = message;
    }
}