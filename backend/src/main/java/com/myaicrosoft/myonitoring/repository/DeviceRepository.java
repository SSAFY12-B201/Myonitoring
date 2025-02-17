package com.myaicrosoft.myonitoring.repository;

import com.myaicrosoft.myonitoring.model.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * 기기(Device) 엔티티에 대한 데이터베이스 접근을 처리하는 레포지토리 인터페이스
 */
public interface DeviceRepository extends JpaRepository<Device, Long> {

    /**
     * 특정 유저와 연결된 모든 기기를 조회
     *
     * @param userId 유저 ID
     * @return 해당 유저와 연결된 모든 기기 목록
     */
    @Query("SELECT d FROM Device d LEFT JOIN FETCH d.cat WHERE d.user.id = :userId")
    List<Device> findAllByUserId(@Param("userId") Long userId);

    /**
     * cat_pk로 device를 조회합니다.
     *
     * @param catId 고양이 ID (Primary Key)
     * @return Cat 엔티티 (Optional)
     */
    @Query("SELECT c.device FROM Cat c WHERE c.id = :catId")
    Optional<Device> findDeviceByCatId(@Param("catId") Long catId);
}
