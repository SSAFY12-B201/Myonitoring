package com.myaicrosoft.myonitoring.service;

import com.myaicrosoft.myonitoring.model.entity.Cat;
import com.myaicrosoft.myonitoring.model.entity.Eye;
import com.myaicrosoft.myonitoring.model.entity.Feeding;
import com.myaicrosoft.myonitoring.model.entity.Intake;
import com.myaicrosoft.myonitoring.repository.CatRepository;
import com.myaicrosoft.myonitoring.repository.EyeRepository;
import com.myaicrosoft.myonitoring.repository.FeedingRepository;
import com.myaicrosoft.myonitoring.repository.IntakeRepository;
import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.dto.DataCollectionRequest;
import com.myaicrosoft.myonitoring.model.entity.*;
import com.myaicrosoft.myonitoring.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;

/**
 * 임베디드 기기로부터 수집된 데이터를 처리하고 저장하는 서비스 클래스
 */
@Slf4j
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
public class DataCollectionService {

    private final CatRepository catRepository;
    private final FeedingRepository feedingRepository;
    private final IntakeRepository intakeRepository;
    private final EyeRepository eyeRepository;
    private final FcmTokenService fcmTokenService;
    private final NotificationLogRepository notificationLogRepository;
    private final NotificationService notificationService;

    /**
     * 수집된 데이터를 저장하는 메서드
     *
     * @param request 수집된 데이터 요청 객체 (DTO)
     */
    @Transactional
    public void saveData(DataCollectionRequest request) {
        // 시리얼 넘버를 통해 고양이 조회
        Cat cat = catRepository.findByDeviceSerialNumber(request.getSerialNumber())
                .orElseThrow(() -> new IllegalArgumentException("해당 시리얼 넘버에 해당하는 고양이를 찾을 수 없습니다. 시리얼 넘버: " + request.getSerialNumber()));

        // 데이터 타입에 따라 처리 분기
        switch (request.getType().toLowerCase()) {
            case "feeding":
                saveFeedingData(cat, request);
                break;
            case "intake":
                saveIntakeData(cat, request);
                break;
            case "eye":
                saveEyeData(cat, request);
                break;
            default:
                throw new IllegalArgumentException("유효하지 않은 데이터 타입입니다: " + request.getType());
        }
    }

    /**
     * Feeding 데이터를 저장하는 메서드
     *
     * @param cat     연결된 고양이 엔티티
     * @param request 수집된 데이터 요청 객체 (DTO)
     */
    private void saveFeedingData(Cat cat, DataCollectionRequest request) {
        Feeding feeding = Feeding.builder()
                .cat(cat)
                .feedingDateTime(request.getDatetime())
                .configuredFeedingAmount(request.getData().getConfiguredAmount())
                .actualFeedingAmount(request.getData().getActualAmount())
                .build();
        feedingRepository.save(feeding);

        // 급여량 이상 감지 및 알림
        checkAndNotifyFeedingAnomaly(cat, request.getData().getConfiguredAmount(), 
                request.getData().getActualAmount());
    }

    /**
     * Intake 데이터를 저장하는 메서드
     *
     * @param cat     연결된 고양이 엔티티
     * @param request 수집된 데이터 요청 객체 (DTO)
     */
    private void saveIntakeData(Cat cat, DataCollectionRequest request) {
        Intake intake = Intake.builder()
                .cat(cat)
                .intakeDateTime(request.getDatetime())
                .intakeDuration(request.getData().getDuration())
                .intakeAmount(request.getData().getAmount())
                .build();
        intakeRepository.save(intake);
    }

    /**
     * Eye 데이터를 저장하는 메서드
     *
     * @param cat     연결된 고양이 엔티티
     * @param request 수집된 데이터 요청 객체 (DTO)
     */
    private void saveEyeData(Cat cat, DataCollectionRequest request) {
        if (request.getData().getEyes() == null || request.getData().getEyes().isEmpty()) {
            throw new IllegalArgumentException("안구 질환 데이터가 비어 있습니다.");
        }

        // Eye 엔티티 생성 및 데이터 설정
        Eye eye = buildEyeEntity(cat, request);
        eyeRepository.save(eye);

        // 안구 질환 감지 및 알림
        checkAndNotifyEyeDisease(cat, request.getData().getEyes());
    }

    /**
     * 안구 질환 여부를 계산하는 메서드
     *
     * @param eye Eye 엔티티 객체
     * @return 안구 질환 여부 (true/false)
     */
    private boolean calculateIsEyeDiseased(Eye eye) {
        return isProbabilityAboveThreshold(eye.getRightBlepharitisProb(), 0.5) ||
                isProbabilityAboveThreshold(eye.getRightConjunctivitisProb(), 0.5) ||
                isProbabilityAboveThreshold(eye.getRightCornealSequestrumProb(), 0.5) ||
                isProbabilityAboveThreshold(eye.getRightNonUlcerativeKeratitisProb(), 0.5) ||
                isProbabilityAboveThreshold(eye.getRightCornealUlcerProb(), 0.5) ||
                isProbabilityAboveThreshold(eye.getLeftBlepharitisProb(), 0.5) ||
                isProbabilityAboveThreshold(eye.getLeftConjunctivitisProb(), 0.5) ||
                isProbabilityAboveThreshold(eye.getLeftCornealSequestrumProb(), 0.5) ||
                isProbabilityAboveThreshold(eye.getLeftNonUlcerativeKeratitisProb(), 0.5) ||
                isProbabilityAboveThreshold(eye.getLeftCornealUlcerProb(), 0.5);
    }

    /**
     * 특정 확률 값이 임계값 이상인지 확인하는 메서드
     *
     * @param probability 확률 값 (BigDecimal)
     * @param threshold   임계값 (double)
     * @return 임계값 이상 여부 (true/false)
     */
    private boolean isProbabilityAboveThreshold(BigDecimal probability, double threshold) {
        return probability != null && probability.compareTo(BigDecimal.valueOf(threshold)) >= 0;
    }

    private void checkAndNotifyFeedingAnomaly(Cat cat, Integer configuredAmount, Integer actualAmount) {
        if (configuredAmount == 0) return;

        double difference = Math.abs(configuredAmount - actualAmount);
        double differencePercentage = (difference / configuredAmount) * 100;

        if (differencePercentage >= 50) {
            try {
                Long userId = cat.getDevice().getUser().getId();
                List<String> userTokens = fcmTokenService.getActiveTokensByUserId(userId);
                
                if (userTokens.isEmpty()) {
                    // FCM 토큰이 없는 경우 로그만 남기고 계속 진행
                    log.warn("사용자 {}의 활성화된 FCM 토큰이 없습니다. 알림 로그는 저장됩니다.", userId);
                }

                String title = "사료 배급량 이상 감지";
                String body = String.format("%s의 사료 배급량이 설정값과 %.1f%% 차이가 발생했습니다.", 
                        cat.getName(), differencePercentage);
                
                // 알림 전송 및 로그 저장 (토큰이 없어도 로그는 저장)
                notificationService.sendNotificationWithLog(cat, title, body, NotificationCategory.DEVICE);
                
            } catch (Exception e) {
                log.error("알림 처리 중 오류 발생 - 고양이: {}, 에러: {}", cat.getName(), e.getMessage());
            }
        }
    }

    private void checkAndNotifyEyeDisease(Cat cat, List<DataCollectionRequest.Payload.EyeInfo> eyes) {
        for (DataCollectionRequest.Payload.EyeInfo eyeInfo : eyes) {
            if (isEyeDiseaseDetected(eyeInfo)) {
                try {
                    String title = "눈 건강 이상 감지";
                    String body = String.format("%s의 눈에서 이상 징후가 감지되었습니다. 상세 내용을 확인해주세요.", 
                            cat.getName());
                    
                    // 알림 전송 및 로그 저장
                    notificationService.sendNotificationWithLog(cat, title, body, NotificationCategory.EYE);
                    break; // 한 번만 알림
                } catch (Exception e) {
                    log.error("눈 건강 알림 처리 중 오류 발생 - 고양이: {}, 에러: {}", cat.getName(), e.getMessage());
                }
            }
        }
    }

    private boolean isEyeDiseaseDetected(DataCollectionRequest.Payload.EyeInfo eyeInfo) {
        return eyeInfo.getBlepharitisProb().compareTo(BigDecimal.valueOf(0.5)) >= 0 ||
                eyeInfo.getConjunctivitisProb().compareTo(BigDecimal.valueOf(0.5)) >= 0 ||
                eyeInfo.getCornealSequestrumProb().compareTo(BigDecimal.valueOf(0.5)) >= 0 ||
                eyeInfo.getNonUlcerativeKeratitisProb().compareTo(BigDecimal.valueOf(0.5)) >= 0 ||
                eyeInfo.getCornealUlcerProb().compareTo(BigDecimal.valueOf(0.5)) >= 0;
    }

    private Eye buildEyeEntity(Cat cat, DataCollectionRequest request) {
        Eye.EyeBuilder eyeBuilder = Eye.builder()
                .cat(cat)
                .capturedDateTime(request.getDatetime());

        for (DataCollectionRequest.Payload.EyeInfo eyeInfo : request.getData().getEyes()) {
            if ("right".equalsIgnoreCase(eyeInfo.getEyeSide())) {
                eyeBuilder
                    .rightBlepharitisProb(eyeInfo.getBlepharitisProb())
                    .rightConjunctivitisProb(eyeInfo.getConjunctivitisProb())
                    .rightCornealSequestrumProb(eyeInfo.getCornealSequestrumProb())
                    .rightNonUlcerativeKeratitisProb(eyeInfo.getNonUlcerativeKeratitisProb())
                    .rightCornealUlcerProb(eyeInfo.getCornealUlcerProb())
                    .rightEyeImageUrl(eyeInfo.getImageUrl());  // 이미지 URL 추가
            } else if ("left".equalsIgnoreCase(eyeInfo.getEyeSide())) {
                eyeBuilder
                    .leftBlepharitisProb(eyeInfo.getBlepharitisProb())
                    .leftConjunctivitisProb(eyeInfo.getConjunctivitisProb())
                    .leftCornealSequestrumProb(eyeInfo.getCornealSequestrumProb())
                    .leftNonUlcerativeKeratitisProb(eyeInfo.getNonUlcerativeKeratitisProb())
                    .leftCornealUlcerProb(eyeInfo.getCornealUlcerProb())
                    .leftEyeImageUrl(eyeInfo.getImageUrl());  // 이미지 URL 추가
            }
        }

        Eye eye = eyeBuilder.build();
        eye.setIsEyeDiseased(calculateIsEyeDiseased(eye));
        return eye;
    }
}
