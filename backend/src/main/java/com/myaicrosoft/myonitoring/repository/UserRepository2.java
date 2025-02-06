package com.myaicrosoft.myonitoring.repository;

import com.myaicrosoft.myonitoring.model.entity.User2;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 사용자(User) 엔티티에 대한 데이터베이스 접근을 처리하는 레포지토리 인터페이스
 * JpaRepository를 상속받아 기본적인 CRUD 메서드를 제공받음
 */
public interface UserRepository2 extends JpaRepository<User2, Long> {
    // JpaRepository에서 기본적으로 제공하는 CRUD 메서드 외 추가 메서드가 필요하다면 여기에 정의 가능
}
