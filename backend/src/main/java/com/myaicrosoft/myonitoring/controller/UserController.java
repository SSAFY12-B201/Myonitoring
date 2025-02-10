package com.myaicrosoft.myonitoring.controller;

import com.myaicrosoft.myonitoring.model.dto.UserResponseDto;
import com.myaicrosoft.myonitoring.model.dto.UserUpdateDto;
import com.myaicrosoft.myonitoring.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getMyInfo(Authentication authentication) {
        if (authentication == null) {
            throw new IllegalStateException("Authentication is required");
        }
        UserResponseDto userInfo = userService.getUserInfo(authentication.getName());
        return ResponseEntity.ok(userInfo);
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponseDto> updateMyInfo(
            Authentication authentication,
            @RequestBody UserUpdateDto updateDto) {
        if (authentication == null) {
            throw new IllegalStateException("Authentication is required");
        }
        UserResponseDto updatedUser = userService.updateUser(authentication.getName(), updateDto);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyAccount(Authentication authentication) {
        if (authentication == null) {
            throw new IllegalStateException("Authentication is required");
        }
        userService.deleteUser(authentication.getName());
        return ResponseEntity.noContent().build();
    }
} 