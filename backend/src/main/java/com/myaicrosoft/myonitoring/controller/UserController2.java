package com.myaicrosoft.myonitoring.controller;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.entity.User2;
import com.myaicrosoft.myonitoring.service.UserService2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 사용자(User) 관련 요청을 처리하는 REST 컨트롤러 클래스
 */
@RestController
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
@RequestMapping("/users") // User 관련 API의 엔드포인트 설정 (기본 경로는 application.properties에서 설정된 /api가 포함됨)
public class UserController2 {

    private final UserService2 userService2;

    /**
     * 사용자 ID로 특정 사용자 조회
     *
     * @param id 조회할 사용자의 ID
     * @return ResponseEntity에 조회된 사용자 정보를 담아 반환
     */
    @GetMapping("/{id}")
    public ResponseEntity<User2> getUser(@PathVariable Long id) {
        User2 user2 = userService2.getUserById(id); // ID를 기준으로 사용자 조회
        return ResponseEntity.ok(user2); // HTTP 200 상태와 함께 사용자 정보 반환
    }
}
