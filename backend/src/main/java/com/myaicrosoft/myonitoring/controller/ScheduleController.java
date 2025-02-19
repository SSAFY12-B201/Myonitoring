package com.myaicrosoft.myonitoring.controller;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.dto.ScheduleResponseDto;
import com.myaicrosoft.myonitoring.model.dto.ScheduleRequestDto;
import com.myaicrosoft.myonitoring.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import org.springframework.http.HttpEntity;

import java.util.List;

/**
 * 급여 스케줄(Schedule) 관련 요청을 처리하는 컨트롤러 클래스
 */
@RestController
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
@RequestMapping("/schedule") // Schedule 관련 API의 기본 경로 설정
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final RestTemplate restTemplate;
    private final String EXTERNAL_API_URL = "http://192.168.30.34:8000";

    /**
     * 예약 스케줄 생성 API
     *
     * @param catId 고양이 ID (Primary Key)
     * @param request 예약 스케줄 생성 요청 데이터 (시간, 양)
     * @return 생성된 스케줄 ID 반환
     */
    @PostMapping("/{catId}")
    public ResponseEntity<Long> createSchedule(
            @PathVariable("catId") Long catId,
            @RequestBody ScheduleRequestDto request) {
        // 스케줄 생성
        Long scheduleId = scheduleService.createSchedule(catId, request);
        
        // 외부 API로 전송할 전체 스케줄 데이터 조회
        List<ScheduleResponseDto> allSchedules = scheduleService.getSchedules(catId);
        
        // 외부 API 호출
        sendSchedulesToDevice(allSchedules);
        
        return ResponseEntity.ok(scheduleId);
    }

    /**
     * 예약 스케줄 조회 API
     *
     * @param catId 고양이 ID (Primary Key)
     * @return 해당 고양이의 디바이스에 대한 모든 스케줄 리스트 반환 (DTO)
     */
    @GetMapping("/{catId}")
    public ResponseEntity<List<ScheduleResponseDto>> getSchedules(@PathVariable("catId") Long catId) {
        List<ScheduleResponseDto> schedules = scheduleService.getSchedules(catId);
        return ResponseEntity.ok(schedules);
    }


    /**
     * 예약 스케줄 수정 (시간, 양) API
     *
     * @param scheduleId 수정할 스케줄 ID (Primary Key)
     * @param request    수정 요청 데이터 (시간, 양)
     * @return HTTP 상태 코드 반환
     */
    @PutMapping("/detail/{scheduleId}")
    public ResponseEntity<Void> updateSchedule(
            @PathVariable("scheduleId") Long scheduleId,
            @RequestBody ScheduleRequestDto request) {
        // 스케줄 업데이트
        scheduleService.updateSchedule(scheduleId, request);
        
        // 해당 스케줄의 catId 조회 및 전체 스케줄 데이터 조회
        Long catId = scheduleService.getCatIdByScheduleId(scheduleId);
        List<ScheduleResponseDto> allSchedules = scheduleService.getSchedules(catId);
        
        // 외부 API 호출
        sendSchedulesToDevice(allSchedules);
        
        return ResponseEntity.noContent().build();
    }

    /**
     * 예약 스케줄 활성화 여부 수정 API
     *
     * @param scheduleId 수정할 스케줄 ID (Primary Key)
     * @return HTTP 상태 코드 반환
     */
    @PutMapping("/detail/{scheduleId}/active")
    public ResponseEntity<Void> toggleScheduleActive(@PathVariable("scheduleId") Long scheduleId) {
        // 스케줄 활성화 상태 토글
        scheduleService.toggleScheduleActive(scheduleId);
        
        // 해당 스케줄의 catId 조회 및 전체 스케줄 데이터 조회
        Long catId = scheduleService.getCatIdByScheduleId(scheduleId);
        List<ScheduleResponseDto> allSchedules = scheduleService.getSchedules(catId);
        
        // 외부 API 호출
        sendSchedulesToDevice(allSchedules);
        
        return ResponseEntity.noContent().build();
    }

    /**
     * 예약 스케줄 삭제 API
     *
     * @param scheduleId 삭제할 스케줄 ID (Primary Key)
     * @return HTTP 상태 코드 반환
     */
    @DeleteMapping("/detail/{scheduleId}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable("scheduleId") Long scheduleId) {
        scheduleService.deleteSchedule(scheduleId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 외부 디바이스로 스케줄 데이터를 전송하는 private 메서드
     */
    private void sendSchedulesToDevice(List<ScheduleResponseDto> schedules) {
        List<Map<String, Object>> scheduleData = new ArrayList<>();
        
        // DTO를 외부 API 형식으로 변환
        for (ScheduleResponseDto schedule : schedules) {
            if (schedule.getIsActive()) {  // 활성화된 스케줄만 전송
                Map<String, Object> scheduleMap = new HashMap<>();
                scheduleMap.put("time", schedule.getTime().toString());
                scheduleMap.put("amount", schedule.getAmount());
                scheduleData.add(scheduleMap);
            }
        }

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // HTTP 요청 객체 생성
        HttpEntity<List<Map<String, Object>>> requestEntity = 
            new HttpEntity<>(scheduleData, headers);

        try {
            // 외부 API로 POST 요청 전송
            restTemplate.postForEntity(EXTERNAL_API_URL, requestEntity, Void.class);
        } catch (Exception e) {
            // 외부 API 호출 실패 시 로그 기록 (실제 구현 시 로깅 프레임워크 사용 권장)
            System.err.println("Failed to send schedules to device: " + e.getMessage());
        }
    }
}
