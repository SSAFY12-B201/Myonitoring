package com.myaicrosoft.myonitoring.repository;

import com.myaicrosoft.myonitoring.model.entity.Statistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

/**
 * StatisticsRepository
 * - 통계 데이터를 저장하고 조회하는 Repository 인터페이스입니다.
 */
public interface StatisticsRepository extends JpaRepository<Statistics, Long> {

    /**
     * 특정 고양이의 특정 날짜 이전 최대 2일간의 통계 데이터를 조회합니다.
     *
     * @param catId      고양이 ID
     * @param startDate  시작 날짜 (포함)
     * @param endDate    종료 날짜 (포함)
     * @return 통계 데이터 리스트
     */
    @Query("SELECT s FROM Statistics s WHERE s.cat.id = :catId AND s.statDate BETWEEN :startDate AND :endDate ORDER BY s.statDate ASC")
    List<Statistics> findByCatIdAndStatDateRange(@Param("catId") Long catId,
                                                 @Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);

    /**
     * 특정 고양이의 특정 날짜 통계 데이터를 조회합니다.
     *
     * @param catId   고양이 ID
     * @param statDate 통계 날짜
     * @return 통계 데이터 객체 (Optional)
     */
    Optional<Statistics> findByCatIdAndStatDate(@Param("catId") Long catId, @Param("statDate") LocalDate statDate);

    /**
     * 특정 고양이의 특정 기간 동안의 통계 데이터를 조회합니다.
     *
     * @param catId      고양이 ID
     * @param startDate  시작 날짜 (포함)
     * @param endDate    종료 날짜 (포함)
     * @return 해당 기간 동안의 모든 통계 데이터 리스트
     */
    @Query("SELECT s FROM Statistics s WHERE s.cat.id = :catId AND s.statDate BETWEEN :startDate AND :endDate")
    List<Statistics> findByCatIdAndStatDateRangeForAverage(@Param("catId") Long catId,
                                                           @Param("startDate") LocalDate startDate,
                                                           @Param("endDate") LocalDate endDate);

    /**
     * 특정 날짜의 모든 통계 데이터를 조회합니다.
     *
     * @param statDate 통계 날짜
     * @return 통계 데이터 리스트
     */
    List<Statistics> findAllByStatDate(LocalDate statDate);

}
