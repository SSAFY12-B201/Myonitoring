package com.myaicrosoft.myonitoring.repository;

import com.myaicrosoft.myonitoring.model.entity.Intake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * IntakeRepository
 * - 섭취 데이터를 조회하는 Repository 인터페이스입니다.
 */
public interface IntakeRepository extends JpaRepository<Intake, Long> {

    /**
     * 특정 기간의 섭취 데이터를 조회
     *
     * @param catId 고양이 ID
     * @param start 시작 시간
     * @param end   종료 시간
     * @return 섭취 데이터 리스트
     */
    List<Intake> findByCatIdAndIntakeDateTimeBetween(Long catId, LocalDateTime start, LocalDateTime end);

    /**
     * 특정 날짜의 섭취 데이터를 조회
     *
     * @param catId 고양이 ID
     * @param date  조회할 날짜
     * @return 섭취 데이터 리스트
     */
    @Query("SELECT i FROM Intake i WHERE i.cat.id = :catId AND DATE(i.intakeDateTime) = :date")
    List<Intake> findByCatIdAndDate(@Param("catId") Long catId, @Param("date") LocalDate date);

    /**
     * 특정 기간의 섭취 데이터를 날짜 범위로 조회
     *
     * @param catId      고양이 ID
     * @param startDate  시작 날짜
     * @param endDate    종료 날짜
     * @return 섭취 데이터 리스트
     */
    @Query("SELECT i FROM Intake i WHERE i.cat.id = :catId AND DATE(i.intakeDateTime) BETWEEN :startDate AND :endDate")
    List<Intake> findByCatIdAndDateRange(@Param("catId") Long catId,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);
}
