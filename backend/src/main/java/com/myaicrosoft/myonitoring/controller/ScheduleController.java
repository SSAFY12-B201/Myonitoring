package com.myaicrosoft.myonitoring.controller;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.dto.ScheduleResponseDto;
import com.myaicrosoft.myonitoring.model.dto.ScheduleRequestDto;
import com.myaicrosoft.myonitoring.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 급여 스케줄(Schedule) 관련 요청을 처리하는 컨트롤러 클래스
 */
@RestController
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
@RequestMapping("/schedule") // Schedule 관련 API의 기본 경로 설정
public class ScheduleController {

    private final ScheduleService scheduleService;

    /**
     * 예약 스케줄 생성 API
     *
     * @param devicePk 디바이스 ID (Primary Key)
     * @param request  예약 스케줄 생성 요청 데이터 (시간, 양)
     * @return 생성된 스케줄 ID 반환
     */
    @PostMapping("/{devicePk}")
    public ResponseEntity<Long> createSchedule(
            @PathVariable("devicePk") Long devicePk,
            @RequestBody ScheduleRequestDto request) {
        Long scheduleId = scheduleService.createSchedule(devicePk, request);
        return ResponseEntity.ok(scheduleId);
    }

    /**
     * 예약 스케줄 조회 API
     *
     * @param devicePk 디바이스 ID (Primary Key)
     * @return 해당 디바이스의 모든 스케줄 리스트 반환 (DTO)
     */
    @GetMapping("/{devicePk}")
    public ResponseEntity<List<ScheduleResponseDto>> getSchedules(@PathVariable("devicePk") Long devicePk) {
        List<ScheduleResponseDto> schedules = scheduleService.getSchedules(devicePk);
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
        scheduleService.updateSchedule(scheduleId, request);
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
        scheduleService.toggleScheduleActive(scheduleId);
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
}
