package com.myaicrosoft.myonitoring.service;

import com.myaicrosoft.myonitoring.model.dto.CatCreateRequest;
import com.myaicrosoft.myonitoring.model.dto.CatDetailResponseDto;
import com.myaicrosoft.myonitoring.model.dto.CatResponseDto;
import com.myaicrosoft.myonitoring.model.dto.CatUpdateRequest;
import com.myaicrosoft.myonitoring.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.dto.*;
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
    private final SecurityUtil securityUtil;

    /**
     * 고양이를 생성하고 저장하는 로직
     *
     * @param request 고양이 생성 요청 데이터 (DTO)
     * @param userId  유저 ID
     * @return 저장된 고양이 엔티티 객체
     */
    @Transactional
    public Cat createCat(CatCreateRequest request, Long userId) {
        Device device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 기기를 찾을 수 없습니다. ID: " + request.getDeviceId()));

        // 기기의 소유자 확인
        boolean isOwner = device.getUser().getId().equals(securityUtil.getCurrentUserId());
        if (!isOwner) {
            throw new IllegalArgumentException("해당 기기의 소유자가 아닙니다.");
        }

        Cat cat = Cat.builder()
                .device(device)
                .name(request.getName())
                .breed(request.getBreed())
                .gender(request.getGender())
                .isNeutered(request.getIsNeutered())
                .birthDate(request.getBirthDate())
                .age(request.getAge())
                .weight(request.getWeight())
                .characteristics(request.getCharacteristics())
                .profileImageUrl(request.getProfileImageUrl())
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

        // 고양이의 소유자 확인
        Device device = cat.getDevice();
        if (device != null) {
            boolean isOwner = device.getUser().getId().equals(securityUtil.getCurrentUserId());
            if (!isOwner) {
                throw new IllegalArgumentException("해당 고양이의 조회 권한이 없습니다.");
            }
        }

        return new CatDetailResponseDto(
                cat.getId(),
                cat.getName(),
                cat.getBreed(),
                cat.getGender(),
                cat.getIsNeutered(),
                cat.getBirthDate(),
                cat.getAge(),
                cat.getWeight(),
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
        // 1. 기존 고양이 데이터 조회
        Cat existingCat = catRepository.findById(catId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 고양이를 찾을 수 없습니다. ID: " + catId));

        // 2. 필수 필드 업데이트 (요청 데이터로 덮어쓰기)
        if (request.getName() == null || request.getBreed() == null || request.getGender() == null ||
                request.getIsNeutered() == null || request.getBirthDate() == null || request.getAge() == null) {
            throw new IllegalArgumentException("필수 데이터가 누락되었습니다.");
        }

        existingCat.setName(request.getName());
        existingCat.setBreed(request.getBreed());
        existingCat.setGender(request.getGender());
        existingCat.setIsNeutered(request.getIsNeutered());
        existingCat.setBirthDate(request.getBirthDate());
        existingCat.setAge(request.getAge());

        // 3. 선택 필드 업데이트 (null 허용)
        existingCat.setCharacteristics(request.getCharacteristics());     // null 가능
        existingCat.setProfileImageUrl(request.getProfileImageUrl());     // null 가능

        // 4. 저장 후 DTO 반환
        Cat updatedCat = catRepository.save(existingCat);

        return new CatDetailResponseDto(
                updatedCat.getId(),
                updatedCat.getName(),
                updatedCat.getBreed(),
                updatedCat.getGender(),
                updatedCat.getIsNeutered(),
                updatedCat.getBirthDate(),
                updatedCat.getAge(),
                updatedCat.getWeight(),
                updatedCat.getCharacteristics(),
                updatedCat.getProfileImageUrl()
        );
    }

    /**
     * 특정 고양이를 삭제하는 로직
     *
     * @param catId 삭제할 고양이 ID (Primary Key)
     */
    @Transactional
    public void deleteCat(Long catId) {
        Cat cat = catRepository.findById(catId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 고양이를 찾을 수 없습니다. ID: " + catId));

        // 고양이의 소유자 확인
        Device device = cat.getDevice();
        if (device != null) {
            boolean isOwner = device.getUser().getId().equals(securityUtil.getCurrentUserId());
            if (!isOwner) {
                throw new IllegalArgumentException("해당 고양이의 삭제 권한이 없습니다.");
            }
        }

        // 연관된 Device와의 관계 해제
        if (device != null) {
            device.setCat(null);
        }

        catRepository.delete(cat);
    }

}

