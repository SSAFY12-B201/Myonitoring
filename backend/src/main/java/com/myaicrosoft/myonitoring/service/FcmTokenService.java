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

            // Firebase 토픽 구독
            subscribeToAlertsTopic(token);

        } catch (Exception e) {
            log.error("Failed to save FCM token", e);
            throw new RuntimeException("Failed to save FCM token: " + e.getMessage(), e);
        }
    }

    private void subscribeToAlertsTopic(String token) {
        try {
            FirebaseMessaging.getInstance().subscribeToTopic(Arrays.asList(token), "alerts");
            log.info("Token subscribed to alerts topic: {}", token);
        } catch (FirebaseMessagingException e) {
            log.error("Failed to subscribe token to topic", e);
        }
    }

    public List<String> getActiveTokens() {
        return fcmTokenRepository.findAllByIsActiveTrue()
            .stream()
            .map(FcmToken::getToken)
            .collect(Collectors.toList());
    }
} 