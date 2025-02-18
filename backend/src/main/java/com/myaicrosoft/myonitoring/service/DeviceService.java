package com.myaicrosoft.myonitoring.service;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.dto.DeviceDetailResponseDto;
import com.myaicrosoft.myonitoring.model.dto.DeviceResponseDto;
import com.myaicrosoft.myonitoring.model.dto.DeviceCreateRequest;
import com.myaicrosoft.myonitoring.model.entity.Cat;
import com.myaicrosoft.myonitoring.model.entity.Device;
import com.myaicrosoft.myonitoring.model.entity.User;
import com.myaicrosoft.myonitoring.repository.DeviceRepository;
import com.myaicrosoft.myonitoring.repository.UserRepository;
import com.myaicrosoft.myonitoring.util.SecurityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Collections;



/**
 * 기기(Device) 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;

    /**
     * 기기를 생성하고 저장하는 로직
     *
     * @param request 기기 생성 요청 데이터 (DTO)
     * @param userId  기기를 등록할 유저 ID
     * @return 저장된 기기 엔티티 객체
     */
    @Transactional
    public Device createDevice(DeviceCreateRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 사용자를 찾을 수 없습니다. ID: " + userId));

        Device device = Device.builder()
                .serialNumber(request.getSerialNumber())
                .user(user)  // 여기서 user를 설정합니다.
                .build();

        return deviceRepository.save(device);
    }


    /**
     * 특정 유저의 모든 기기를 조회하고 DTO로 변환하여 반환하는 로직
     *
     * @param userId 유저 ID
     * @return 해당 유저와 연결된 모든 기기에 대한 응답 DTO 목록
     */
    public List<DeviceResponseDto> getDevicesByUserId(Long userId) {
        List<Device> devices = deviceRepository.findAllByUserId(userId);
        return devices.stream()
                .map(device -> new DeviceResponseDto(
                        device.getId(),
                        device.getSerialNumber(),
                        device.getRegistrationDate(),
                        device.getCat() != null ? device.getCat().getId() : null,
                        device.getCat() != null ? device.getCat().getName() : null
                ))
                .collect(Collectors.toList());
    }


    /**
     * 특정 기기를 조회하고 DTO로 변환하여 반환하는 로직
     *
     * @param catId 조회할 기기에 연결된 고양이 ID (Primary Key)
     * @return 조회된 기기에 대한 상세 응답 DTO 객체
     */
    public DeviceDetailResponseDto getDeviceByCatId(Long catId) {
        Device device = deviceRepository.findDeviceByCatId(catId)
                .orElseThrow(() -> new IllegalArgumentException("해당 고양이 ID에 연결된 기기를 찾을 수 없습니다. ID: " + catId));

        if (!isDeviceOwner(device)) {
            throw new IllegalArgumentException("해당 기기의 조회 권한이 없습니다.");
        }

        return convertToDto(device);
    }

    /**
     * 특정 고양이에 연결된 기기를 삭제하는 로직
     *
     * @param catId 삭제할 기기에 연결된 고양이 ID (Primary Key)
     */
    @Transactional
    public void deleteDeviceByCatId(Long catId) {
        Device device = deviceRepository.findDeviceByCatId(catId)
                .orElseThrow(() -> new IllegalArgumentException("해당 고양이 ID에 연결된 기기를 찾을 수 없습니다. ID: " + catId));

        // 기기의 소유자 확인
        boolean isOwner = device.getUser().getId().equals(securityUtil.getCurrentUserId());
        if (!isOwner) {
            throw new IllegalArgumentException("해당 기기의 삭제 권한이 없습니다.");
        }

        deviceRepository.delete(device);
    }

    /**
     * 기기의 소유자인지 확인하는 메서드
     *
     * @param device 확인할 기기 객체
     * @return 현재 로그인한 사용자가 해당 기기의 소유자인 경우 true, 그렇지 않으면 false
     */
    private boolean isDeviceOwner(Device device) {
        return device.getUser().getId().equals(securityUtil.getCurrentUserId());

    }

    /**
     * Device 엔티티를 DeviceDetailResponseDto로 변환하는 메서드
     * @param device 변환할 기기 객체
     * @return 기기 정보를 담은 DeviceDetailResponseDto 객체
     */
    public DeviceDetailResponseDto convertToDto(Device device) {
        Cat cat = device.getCat();
        DeviceDetailResponseDto.CatInfo catInfo = (cat != null) ?
                new DeviceDetailResponseDto.CatInfo(cat.getId(), cat.getName()) : null;

        List<DeviceDetailResponseDto.UserInfo> users = Collections.singletonList(
                new DeviceDetailResponseDto.UserInfo(device.getUser().getId(), device.getUser().getEmail())
        );

        return new DeviceDetailResponseDto(
                device.getId(),
                device.getRegistrationDate(),
                device.getSerialNumber(),
                catInfo,
                users
        );
    }
}
