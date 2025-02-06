package com.myaicrosoft.myonitoring.service;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.entity.User2;
import com.myaicrosoft.myonitoring.repository.UserRepository2;
import org.springframework.stereotype.Service;

/**
 * 사용자(User) 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
public class UserService2 {

    private final UserRepository2 userRepository2;

    /**
     * 사용자 ID로 특정 사용자 조회
     *
     * @param id 조회할 사용자의 ID
     * @return 조회된 사용자 엔티티 객체
     * @throws IllegalArgumentException 사용자가 존재하지 않을 경우 예외 발생
     */
    public User2 getUserById(Long id) {
        return userRepository2.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 사용자를 찾을 수 없습니다. ID: " + id));
    }
}
