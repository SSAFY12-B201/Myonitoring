package com.myaicrosoft.myonitoring.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cats") // 테이블 이름 지정
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "device_id", nullable = false) // 외래 키 이름 지정
    private Device device;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(length = 50)
    private String breed;

    @Enumerated(EnumType.STRING) // Enum 값을 문자열로 저장 (예: "M", "F")
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false)
    private Boolean isNeutered;

    @Column(nullable = false)
    private LocalDate birthDate;

    @Column(nullable = false)
    private Integer age;

    @Column(precision = 5, scale = 2)
    private BigDecimal weight;

    @Column(columnDefinition = "TEXT")
    private String characteristics;

    @Column(length = 255)
    private String profileImageUrl;
}
