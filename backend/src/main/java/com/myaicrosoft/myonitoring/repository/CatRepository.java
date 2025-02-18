package com.myaicrosoft.myonitoring.repository;

import com.myaicrosoft.myonitoring.model.entity.Cat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * 고양이(Cat) 엔티티에 대한 데이터베이스 접근을 처리하는 레포지토리 인터페이스
 */
public interface CatRepository extends JpaRepository<Cat, Long> {

    /**
     * 특정 유저와 연결된 모든 고양이를 조회
     *
     * @param userId 유저 ID
     * @return 해당 유저와 연결된 모든 고양이 목록
     */
    @Query("SELECT c FROM Cat c JOIN c.device d WHERE d.user.id = :userId")
    List<Cat> findAllByUserId(@Param("userId") Long userId);

    /**
     * 기기의 시리얼 번호를 통해 고양이를 조회
     *
     * @param serialNumber 기기의 시리얼 번호
     * @return 해당 시리얼 번호와 연결된 고양이 (Optional)
     */
    @Query("SELECT c FROM Cat c JOIN c.device d WHERE d.serialNumber = :serialNumber")
    Optional<Cat> findByDeviceSerialNumber(@Param("serialNumber") String serialNumber);
}
