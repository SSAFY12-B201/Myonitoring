package com.myaicrosoft.myonitoring.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.myaicrosoft.myonitoring.model.entity.FcmToken;
import com.myaicrosoft.myonitoring.model.entity.User;
import com.myaicrosoft.myonitoring.repository.FcmTokenRepository;
import com.myaicrosoft.myonitoring.repository.UserRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;

@Service
@RequiredArgsConstructor
@Slf4j
public class FcmTokenService {
    
    private final FcmTokenRepository fcmTokenRepository;
    private final UserRepository userRepository;

    @Transactional
    public void saveToken(String token, Long userId) {
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

            // 토큰 중복 확인
            Optional<FcmToken> existingTokenOptional = fcmTokenRepository.findByToken(token);

            if(existingTokenOptional.isPresent()) {
                FcmToken existingToken = existingTokenOptional.get();

                // 이미 같은 사용자의 토큰이면 활성화
                if(existingToken.getUser().getId().equals(userId)) {
                    existingToken.setActive(true);
                    fcmTokenRepository.save(existingToken);
                    return;
                }

                // 다른 사용자의 토큰이면 기존 토큰 비활성화
                existingToken.setActive(false);
                fcmTokenRepository.save(existingToken);
            }

            // 기존 토큰이 있다면 비활성화
            fcmTokenRepository.findByUserAndIsActiveTrue(user)
                .ifPresent(FcmToken::deactivate);

            // 새 토큰 저장
            FcmToken fcmToken = FcmToken.builder()
                .token(token)
                .user(user)
                .build();
            
            fcmTokenRepository.save(fcmToken);
            log.info("FCM 토큰 저장 완료 - 사용자: {}, 토큰: {}", userId, token);

        } catch (Exception e) {
            log.error("FCM 토큰 저장 실패", e);
            throw new RuntimeException("FCM 토큰 저장 실패: " + e.getMessage(), e);
        }
    }

    public List<String> getActiveTokens() {
        return fcmTokenRepository.findAllByIsActiveTrue()
            .stream()
            .map(FcmToken::getToken)
            .collect(Collectors.toList());
    }

    public List<String> getActiveTokensByUserId(Long userId) {
        return fcmTokenRepository.findByUserIdAndIsActiveTrue(userId)
                .stream()
                .map(FcmToken::getToken)
                .collect(Collectors.toList());
    }
} 