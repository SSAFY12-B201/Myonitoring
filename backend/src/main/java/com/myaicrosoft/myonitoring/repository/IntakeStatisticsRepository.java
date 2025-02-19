package com.myaicrosoft.myonitoring.repository;

import com.myaicrosoft.myonitoring.model.entity.IntakeStatistics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IntakeStatisticsRepository extends JpaRepository<IntakeStatistics, Long> {
    List<IntakeStatistics> findByChangeDaysGreaterThanEqual(int days);
} 