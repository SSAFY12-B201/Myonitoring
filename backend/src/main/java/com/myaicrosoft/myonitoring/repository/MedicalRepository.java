package com.myaicrosoft.myonitoring.repository;

import com.myaicrosoft.myonitoring.model.entity.Medical;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

/**
 * 의료 기록 데이터를 조회하는 Repository 인터페이스입니다.
 */
public interface MedicalRepository extends JpaRepository<Medical, Long> {

    /**
     * 특정 고양이의 특정 날짜 의료 기록 중 가장 최신 데이터를 조회합니다.
     *
     * @param catId      고양이 ID
     * @param visitDate 방문 날짜
     * @return 가장 최신의 의료 기록 데이터 (Optional)
     */
    Optional<Medical> findTopByCatIdAndVisitDateOrderByVisitTimeDesc(Long catId, LocalDate visitDate);
}
