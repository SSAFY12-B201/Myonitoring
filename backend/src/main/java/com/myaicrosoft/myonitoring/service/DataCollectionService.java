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

import java.math.BigDecimal;

/**
 * 임베디드 기기로부터 수집된 데이터를 처리하고 저장하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
public class DataCollectionService {

    private final CatRepository catRepository;
    private final FeedingRepository feedingRepository;
    private final IntakeRepository intakeRepository;
    private final EyeRepository eyeRepository;

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
        Eye.EyeBuilder eyeBuilder = Eye.builder()
                .cat(cat)
                .capturedDateTime(request.getDatetime());

        for (DataCollectionRequest.Payload.EyeInfo eyeInfo : request.getData().getEyes()) {
            if ("right".equalsIgnoreCase(eyeInfo.getEyeSide())) {
                eyeBuilder.rightBlepharitisProb(eyeInfo.getBlepharitisProb())
                        .rightConjunctivitisProb(eyeInfo.getConjunctivitisProb())
                        .rightCornealSequestrumProb(eyeInfo.getCornealSequestrumProb())
                        .rightNonUlcerativeKeratitisProb(eyeInfo.getNonUlcerativeKeratitisProb())
                        .rightCornealUlcerProb(eyeInfo.getCornealUlcerProb());
            } else if ("left".equalsIgnoreCase(eyeInfo.getEyeSide())) {
                eyeBuilder.leftBlepharitisProb(eyeInfo.getBlepharitisProb())
                        .leftConjunctivitisProb(eyeInfo.getConjunctivitisProb())
                        .leftCornealSequestrumProb(eyeInfo.getCornealSequestrumProb())
                        .leftNonUlcerativeKeratitisProb(eyeInfo.getNonUlcerativeKeratitisProb())
                        .leftCornealUlcerProb(eyeInfo.getCornealUlcerProb());
            }
        }

        Eye eye = eyeBuilder.build();
        eye.setIsEyeDiseased(calculateIsEyeDiseased(eye));
        eyeRepository.save(eye);
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
}
