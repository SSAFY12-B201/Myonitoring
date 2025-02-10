package com.myaicrosoft.myonitoring.repository;

import com.myaicrosoft.myonitoring.model.entity.Eye;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * EyeRepository
 * - 안구 질환 데이터를 조회하는 Repository 인터페이스입니다.
 */
public interface EyeRepository extends JpaRepository<Eye, Long> {

    /**
     * 특정 고양이의 특정 기간 동안 isEyeDiseased가 true인 가장 최신 데이터를 조회
     *
     * @param catId       고양이 ID
     * @param startOfDay  조회 시작 시간
     * @param endOfDay    조회 종료 시간
     * @param isEyeDiseased 안구 질환 여부 (true)
     * @return 가장 최신의 안구 질환 데이터 (Optional)
     */
    Optional<Eye> findTopByCatIdAndCapturedDateTimeBetweenAndIsEyeDiseasedOrderByCapturedDateTimeDesc(
            Long catId,
            LocalDateTime startOfDay,
            LocalDateTime endOfDay,
            Boolean isEyeDiseased);
}
