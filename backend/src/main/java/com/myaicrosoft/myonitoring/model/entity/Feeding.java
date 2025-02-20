package com.myaicrosoft.myonitoring.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "feeding_records") // 테이블 이름 지정
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feeding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "cat_id",
        nullable = false,
        foreignKey = @ForeignKey(
            name = "fk_feeding_cat",
            foreignKeyDefinition = "FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE"
        )
    )
    private Cat cat;

    @Column(nullable = false)
    private LocalDateTime feedingDateTime;

    // 설정된 급여량
    @Column(nullable = false)
    private Integer configuredFeedingAmount;

    // 실제 급여된 급여량
    @Column(nullable = false)
    private Integer actualFeedingAmount;
}
