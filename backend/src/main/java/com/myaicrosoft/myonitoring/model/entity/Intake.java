package com.myaicrosoft.myonitoring.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "intake_records") // 테이블 이름 지정
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Intake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "cat_id",
        nullable = false,
        foreignKey = @ForeignKey(
            name = "fk_intake_cat",
            foreignKeyDefinition = "FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE"
        )
    )
    private Cat cat;

    @Column(nullable = false)
    private LocalDateTime intakeDateTime;

    @Column(nullable = false)
    private Integer intakeDuration;

    @Column(precision = 6, scale = 2)
    private Integer intakeAmount;
}
