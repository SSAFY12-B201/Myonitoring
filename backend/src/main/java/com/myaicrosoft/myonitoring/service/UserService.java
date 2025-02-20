package com.myaicrosoft.myonitoring.service;

import com.myaicrosoft.myonitoring.model.dto.UserRegistrationDto;
import com.myaicrosoft.myonitoring.model.dto.UserResponseDto;
import com.myaicrosoft.myonitoring.model.dto.UserUpdateDto;
import com.myaicrosoft.myonitoring.model.entity.User;
import com.myaicrosoft.myonitoring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("Email cannot be empty");
    }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    @Transactional
    public User registerUser(UserRegistrationDto registrationDto, User.Provider provider) {
        // 입력값 검증
        if (!StringUtils.hasText(registrationDto.getEmail())) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (!StringUtils.hasText(registrationDto.getNickname())) {
            throw new IllegalArgumentException("Nickname cannot be empty");
        }
        if (provider == null) {
            throw new IllegalArgumentException("Provider cannot be null");
        }

        // 이미 존재하는 계정인지 확인
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("Account already exists");
    }

        // 새 계정 생성
        User user = new User();
        user.setEmail(registrationDto.getEmail());
        user.setProvider(provider);
        user.setRole(User.Role.USER);
        user.setPassword(""); // OAuth2 사용자는 비밀번호가 필요 없음
        user.setNickname(registrationDto.getNickname());
        user.setAddress(registrationDto.getAddress());
        user.setPhoneNumber(registrationDto.getPhoneNumber());

        return userRepository.save(user);
    }

    @Transactional
    public void updateRefreshToken(String email, String refreshToken) {
        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (!StringUtils.hasText(refreshToken)) {
            throw new IllegalArgumentException("Refresh token cannot be empty");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        user.setRefreshToken(refreshToken);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserResponseDto getUserInfo(String email) {
        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return UserResponseDto.from(user);
    }

    @Transactional
    public UserResponseDto updateUser(String email, UserUpdateDto updateDto) {
        // 입력값 검증
        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        // 사용자 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // 정보 업데이트
        if (StringUtils.hasText(updateDto.getNickname())) {
            user.setNickname(updateDto.getNickname());
        }
        user.setAddress(updateDto.getAddress());
        user.setPhoneNumber(updateDto.getPhoneNumber());

        // 저장 및 응답
        User savedUser = userRepository.save(user);
        return UserResponseDto.from(savedUser);
    }

    @Transactional
    public void deleteUser(String email) {
        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // 회원 삭제 전 로깅
        log.info("Deleting user with email: {}", email);
        
        // 회원 삭제
        userRepository.delete(user);

        log.info("User deleted successfully: {}", email);
    }

    public void logout(String email, String accessToken) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        // 로그아웃 시 refresh token 삭제
        user.setRefreshToken(null);
        userRepository.save(user);
    }

    /**
     * 사용자 ID로 특정 사용자 조회
     *
     * @param id 조회할 사용자의 ID
     * @return 조회된 사용자에 대한 응답 DTO
     * @throws IllegalArgumentException 사용자가 존재하지 않을 경우 예외 발생
     */
    @Transactional(readOnly = true)
    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 사용자를 찾을 수 없습니다. ID: " + id));
        return UserResponseDto.from(user);
    }

    @Transactional
    public void removeRefreshToken(String refreshToken) {
        // 리프레시 토큰으로 사용자를 찾아서 토큰 제거
        User user = userRepository.findByRefreshToken(refreshToken)
                .orElse(null);
        
        if (user != null) {
            user.setRefreshToken(null);
            userRepository.save(user);
        }
    }
} 
