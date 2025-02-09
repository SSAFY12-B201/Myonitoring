package com.myaicrosoft.myonitoring.repository;

import com.myaicrosoft.myonitoring.model.entity.Feeding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

/**
 * FeedingRepository
 * - 급여 데이터를 조회하는 Repository 인터페이스입니다.
 */
public interface FeedingRepository extends JpaRepository<Feeding, Long> {

    /**
     * 특정 고양이의 특정 주간 급여 데이터를 조회
     *
     * @param catId       고양이 ID
     * @param startOfWeek 주간 시작 시간
     * @param endOfWeek   주간 종료 시간
     * @return 급여 데이터 리스트
     */
    @Query("SELECT f FROM Feeding f WHERE f.cat.id = :catId AND f.feedingDateTime BETWEEN :startOfWeek AND :endOfWeek")
    List<Feeding> findByCatIdAndWeek(Long catId, LocalDateTime startOfWeek, LocalDateTime endOfWeek);

    /**
     * 특정 날짜의 급여 데이터를 조회
     *
     * @param catId      고양이 ID
     * @param startOfDay 시작 시간
     * @param endOfDay   종료 시간
     * @return 급여 데이터 리스트
     */
    List<Feeding> findByCatIdAndFeedingDateTimeBetween(Long catId, LocalDateTime startOfDay, LocalDateTime endOfDay);
}
