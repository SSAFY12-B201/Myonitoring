package com.myaicrosoft.myonitoring.service;

import com.myaicrosoft.myonitoring.model.dto.CatCreateRequest;
import com.myaicrosoft.myonitoring.model.dto.CatDetailResponseDto;
import com.myaicrosoft.myonitoring.model.dto.CatResponseDto;
import com.myaicrosoft.myonitoring.model.dto.CatUpdateRequest;
import lombok.RequiredArgsConstructor;
import myonitoring_prac.myonitoring_prac_jpa.model.dto.*;
import com.myaicrosoft.myonitoring.model.entity.Cat;
import com.myaicrosoft.myonitoring.model.entity.Device;
import com.myaicrosoft.myonitoring.repository.CatRepository;
import com.myaicrosoft.myonitoring.repository.DeviceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 고양이(Cat) 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
public class CatService {

    private final CatRepository catRepository;
    private final DeviceRepository deviceRepository;

    /**
     * 고양이를 생성하고 저장하는 로직
     *
     * @param request 고양이 생성 요청 데이터 (DTO)
     * @return 저장된 고양이 엔티티 객체
     */
    @Transactional
    public Cat createCat(CatCreateRequest request) {
        Device device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 기기를 찾을 수 없습니다. ID: " + request.getDeviceId()));

        Cat cat = Cat.builder()
                .device(device)
                .name(request.getName())
                .breed(request.getBreed())
                .gender(request.getGender())
                .isNeutered(request.getIsNeutered())
                .birthDate(request.getBirthDate())
                .age(request.getAge())
                .weight(request.getWeight())
                .targetDailyIntake(request.getTargetDailyIntake()) // 선택 값 처리
                .characteristics(request.getCharacteristics()) // 선택 값 처리
                .profileImageUrl(request.getProfileImageUrl()) // 선택 값 처리
                .build();

        return catRepository.save(cat);
    }

    /**
     * 특정 유저의 모든 고양이를 조회하고 DTO로 변환하여 반환하는 로직
     *
     * @param userId 유저 ID
     * @return 해당 유저와 연결된 모든 고양이에 대한 응답 DTO 목록
     */
    public List<CatResponseDto> getCatsByUserId(Long userId) {
        List<Cat> cats = catRepository.findAllByUserId(userId);
        return cats.stream()
                .map(cat -> new CatResponseDto(cat.getId(), cat.getName(), cat.getProfileImageUrl()))
                .collect(Collectors.toList());
    }

    /**
     * 특정 고양이를 조회하고 DTO로 변환하여 반환하는 로직
     *
     * @param catId 조회할 고양이 ID (Primary Key)
     * @return 조회된 고양이에 대한 상세 응답 DTO 객체
     */
    public CatDetailResponseDto getCatById(Long catId) {
        Cat cat = catRepository.findById(catId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 고양이를 찾을 수 없습니다. ID: " + catId));

        return new CatDetailResponseDto(
                cat.getId(),
                cat.getName(),
                cat.getBreed(),
                cat.getGender(),
                cat.getIsNeutered(),
                cat.getBirthDate(),
                cat.getAge(),
                cat.getWeight(),
                cat.getTargetDailyIntake(),
                cat.getCharacteristics(),
                cat.getProfileImageUrl()
        );
    }

    /**
     * 특정 고양이를 수정하는 로직
     *
     * @param catId   수정할 고양이 ID (Primary Key)
     * @param request 수정 요청 데이터 (DTO)
     * @return 수정된 고양이에 대한 상세 응답 DTO 객체
     */
    @Transactional
    public CatDetailResponseDto updateCat(Long catId, CatUpdateRequest request) {
        Cat existingCat = catRepository.findById(catId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 고양이를 찾을 수 없습니다. ID: " + catId));

        // 요청 데이터가 존재할 경우에만 업데이트 수행
        if (request.getName() != null) existingCat.setName(request.getName());
        if (request.getBreed() != null) existingCat.setBreed(request.getBreed());
        if (request.getGender() != null) existingCat.setGender(request.getGender());
        if (request.getIsNeutered() != null) existingCat.setIsNeutered(request.getIsNeutered());
        if (request.getBirthDate() != null) existingCat.setBirthDate(request.getBirthDate());
        if (request.getAge() != null) existingCat.setAge(request.getAge());
        if (request.getWeight() != null) existingCat.setWeight(request.getWeight());
        if (request.getTargetDailyIntake() != null) existingCat.setTargetDailyIntake(request.getTargetDailyIntake());
        if (request.getCharacteristics() != null) existingCat.setCharacteristics(request.getCharacteristics());
        if (request.getProfileImageUrl() != null) existingCat.setProfileImageUrl(request.getProfileImageUrl());

        return new CatDetailResponseDto(
                existingCat.getId(),
                existingCat.getName(),
                existingCat.getBreed(),
                existingCat.getGender(),
                existingCat.getIsNeutered(),
                existingCat.getBirthDate(),
                existingCat.getAge(),
                existingCat.getWeight(),
                existingCat.getTargetDailyIntake(),
                existingCat.getCharacteristics(),
                existingCat.getProfileImageUrl()
        );
    }

    /**
     * 특정 고양이를 삭제하는 로직
     *
     * @param catId 삭제할 고양이 ID (Primary Key)
     */
    @Transactional
    public void deleteCat(Long catId) {
        // 고양이 엔티티 조회
        Cat cat = catRepository.findById(catId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 고양이를 찾을 수 없습니다. ID: " + catId));

        // 연관된 Device와의 관계 해제
        Device device = cat.getDevice();
        if (device != null) {
            device.setCat(null); // Device에서 Cat 참조 제거
        }

        // 고양이 삭제
        catRepository.delete(cat);
    }

}
