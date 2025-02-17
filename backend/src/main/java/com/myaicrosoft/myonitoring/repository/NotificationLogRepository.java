package com.myaicrosoft.myonitoring.repository;

import com.myaicrosoft.myonitoring.model.entity.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * NotificationLogRepository
 * - 알림 로그 데이터를 저장하고 조회하는 Repository 인터페이스입니다.
 */
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {

    /**
     * 특정 고양이의 모든 알림 로그 데이터를 날짜 및 시간 내림차순으로 조회합니다.
     *
     * @param catId 고양이 ID
     * @return 알림 로그 리스트 (날짜 및 시간 내림차순)
     */
    List<NotificationLog> findByCatIdOrderByNotificationDateTimeDesc(Long catId);
}
