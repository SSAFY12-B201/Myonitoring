package com.myaicrosoft.myonitoring.repository;

import com.myaicrosoft.myonitoring.model.entity.Statistics;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * StatisticsRepository
 * - 통계 데이터를 저장하고 조회하는 Repository 인터페이스입니다.
 */
public interface StatisticsRepository extends JpaRepository<Statistics, Long> {
    // 기본적인 CRUD 메서드는 JpaRepository에서 제공
}
