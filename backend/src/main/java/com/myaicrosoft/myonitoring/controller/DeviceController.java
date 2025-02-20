package com.myaicrosoft.myonitoring.controller;

import com.myaicrosoft.myonitoring.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.dto.DeviceDetailResponseDto;
import com.myaicrosoft.myonitoring.model.dto.DeviceResponseDto;
import com.myaicrosoft.myonitoring.model.dto.DeviceCreateRequest;
import com.myaicrosoft.myonitoring.model.dto.DeviceCreateResponse;
import com.myaicrosoft.myonitoring.model.entity.Cat;
import com.myaicrosoft.myonitoring.model.entity.Device;
import com.myaicrosoft.myonitoring.service.DeviceService;
import com.myaicrosoft.myonitoring.util.SecurityUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 기기(Device) 관련 요청을 처리하는 REST 컨트롤러 클래스
 */
@RestController
@RequestMapping("/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;
    private final SecurityUtil securityUtil;
    private final DeviceRepository deviceRepository;

    /**
     * 기기 생성 API
     *
     * @param request 기기 생성 요청 데이터 (DTO)
     * @return 생성된 기기 응답 데이터 (DTO)
     */
    @PostMapping
    public ResponseEntity<DeviceCreateResponse> createDevice(@RequestBody DeviceCreateRequest request) {
        Long userId = securityUtil.getCurrentUserId();
        Device device = deviceService.createDevice(request, userId);

        Long catId = (device.getCat() != null) ? device.getCat().getId() : null;

        // Device 엔티티를 DTO로 변환하여 반환
        DeviceCreateResponse response = new DeviceCreateResponse(
                device.getId(),
                device.getSerialNumber(),
                device.getUser().getId(),
                catId
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 특정 유저의 모든 기기를 조회 API
     *
     * @return 유저와 연결된 기기 목록 (DTO)
     */
    @GetMapping
    public ResponseEntity<List<DeviceResponseDto>> getDevicesByUser() {
        Long userId = securityUtil.getCurrentUserId();
        List<DeviceResponseDto> devices = deviceService.getDevicesByUserId(userId);
        return ResponseEntity.ok(devices);
    }

    /**
     * 특정 기기를 조회 API
     *
     * @param catId 조회할 기기에 연결된 고양이 ID (Primary Key)
     * @return 조회된 기기의 상세 정보 (DTO)
     */
    @GetMapping("/{catId}")
    public ResponseEntity<DeviceDetailResponseDto> getDevice(@PathVariable Long catId) {
        Device device = deviceRepository.findDeviceByCatId(catId)
                .orElseThrow(() -> new IllegalArgumentException("해당 고양이 ID에 연결된 기기를 찾을 수 없습니다. ID: " + catId));
        DeviceDetailResponseDto deviceDto = deviceService.convertToDto(device);
        return ResponseEntity.ok(deviceDto);
    }

    /**
     * 특정 고양이에 연결된 기기를 삭제 API
     *
     * @param catId 삭제할 기기에 연결된 고양이 ID (Primary Key)
     * @return HTTP 204 상태 코드 반환
     */
    @DeleteMapping("/{catId}")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long catId) {
        deviceService.deleteDeviceByCatId(catId);
        return ResponseEntity.noContent().build();
    }
}
