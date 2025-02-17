package com.myaicrosoft.myonitoring.repository;

import com.myaicrosoft.myonitoring.model.entity.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 알림 로그(NotificationLog) 엔티티에 대한 데이터베이스 접근을 처리하는 레포지토리 인터페이스
 */
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
    // 기본적인 CRUD 작업은 JpaRepository에서 제공하므로 추가 메서드가 필요 없다면 비워둘 수 있습니다.
}
