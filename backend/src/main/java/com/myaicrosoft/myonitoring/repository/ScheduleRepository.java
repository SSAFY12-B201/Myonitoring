package com.myaicrosoft.myonitoring.repository;

import com.myaicrosoft.myonitoring.model.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * 급여 스케줄(Schedule)을 관리하는 Repository 인터페이스입니다.
 */
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    /**
     * 특정 디바이스의 모든 예약 스케줄 조회 메서드.
     *
     * @param deviceId 디바이스 ID.
     * @return 해당 디바이스와 연결된 모든 예약 스케줄 리스트.
     */
    List<Schedule> findByDeviceId(Long deviceId);
}
