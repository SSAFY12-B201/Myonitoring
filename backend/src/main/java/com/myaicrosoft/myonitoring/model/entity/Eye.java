package com.myaicrosoft.myonitoring.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "eye_records") // 테이블 이름 지정
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Eye {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cat_id", nullable = false) // 외래 키 이름 지정
    private Cat cat;

    @Column(nullable = false)
    private LocalDateTime capturedDateTime;

    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal rightBlepharitisProb;

    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal rightConjunctivitisProb;

    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal rightCornealSequestrumProb;

    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal rightNonUlcerativeKeratitisProb;

    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal rightCornealUlcerProb;

    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal leftBlepharitisProb;

    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal leftConjunctivitisProb;

    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal leftCornealSequestrumProb;

    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal leftNonUlcerativeKeratitisProb;

    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal leftCornealUlcerProb;

    @Column(nullable = false)
    private Boolean isEyeDiseased;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT, foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE"))
    private User user;
}
