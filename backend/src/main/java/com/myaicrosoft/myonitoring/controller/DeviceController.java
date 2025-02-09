package com.myaicrosoft.myonitoring.controller;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.dto.DeviceDetailResponseDto;
import com.myaicrosoft.myonitoring.model.dto.DeviceResponseDto;
import com.myaicrosoft.myonitoring.model.dto.DeviceCreateRequest;
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
@RequestMapping("${app.api-prefix}/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;
    private final SecurityUtil securityUtil;

    /**
     * 기기 생성 API
     *
     * @param request 기기 생성 요청 데이터 (DTO)
     * @return 생성된 기기 엔티티
     */
    @PostMapping
    public ResponseEntity<Device> createDevice(@RequestBody DeviceCreateRequest request) {
        Long userId = securityUtil.getCurrentUserId();
        Device device = deviceService.createDevice(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(device);
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
     * @param deviceId 조회할 기기 ID (Primary Key)
     * @return 조회된 기기의 상세 정보 (DTO)
     */
    @GetMapping("/{deviceId}")
    public ResponseEntity<DeviceDetailResponseDto> getDevice(@PathVariable Long deviceId) {
        DeviceDetailResponseDto device = deviceService.getDeviceById(deviceId);
        return ResponseEntity.ok(device);
    }

    /**
     * 특정 기기를 삭제 API
     *
     * @param deviceId 삭제할 기기 ID (Primary Key)
     * @return HTTP 204 상태 코드 반환
     */
    @DeleteMapping("/{deviceId}")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long deviceId) {
        deviceService.deleteDeviceById(deviceId);
        return ResponseEntity.noContent().build();
    }
}
