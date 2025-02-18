package com.myaicrosoft.myonitoring.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "medical_records") // 테이블 이름 지정
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "cat_id", 
        nullable = false,
        foreignKey = @ForeignKey(
            name = "fk_medical_cat",
            foreignKeyDefinition = "FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE"
        )
    )
    private Cat cat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MedicalCategory category;

    @Column(length = 100, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100, nullable = false)
    private String hospitalName;

    @Column(nullable = false)
    private LocalDate visitDate;

    @Column(nullable = false)
    private LocalTime visitTime;
}
