package com.myaicrosoft.myonitoring.service;

import com.myaicrosoft.myonitoring.model.dto.ScheduleRequestDto;
import com.myaicrosoft.myonitoring.model.dto.ScheduleResponseDto;
import com.myaicrosoft.myonitoring.model.entity.Device;
import com.myaicrosoft.myonitoring.model.entity.Schedule;
import com.myaicrosoft.myonitoring.repository.DeviceRepository;
import com.myaicrosoft.myonitoring.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 급여 스케줄(Schedule) 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final DeviceRepository deviceRepository;

    /**
     * 예약 스케줄 생성 로직
     *
     * @param catId 고양이 ID (Primary Key)
     * @param request 예약 스케줄 생성 요청 데이터 (시간, 양)
     * @return 생성된 스케줄 ID 반환
     */
    @Transactional
    public Long createSchedule(Long catId, ScheduleRequestDto request) {
        Device device = deviceRepository.findDeviceByCatId(catId)
                .orElseThrow(() -> new IllegalArgumentException("해당 고양이 ID에 연결된 디바이스를 찾을 수 없습니다. ID: " + catId));

        Schedule schedule = Schedule.builder()
                .device(device)
                .scheduledTime(request.getScheduledTime())
                .scheduledAmount(request.getScheduledAmount())
                .isActive(true) // 기본값으로 true 설정
                .build();

        return scheduleRepository.save(schedule).getId();
    }


    /**
     * 특정 고양이의 디바이스에 대한 모든 예약 스케줄 조회 로직
     *
     * @param catId 고양이 ID (Primary Key)
     * @return 해당 고양이의 디바이스에 대한 모든 스케줄 리스트 반환 (DTO)
     */
    public List<ScheduleResponseDto> getSchedules(Long catId) {
        Device device = deviceRepository.findDeviceByCatId(catId)
                .orElseThrow(() -> new IllegalArgumentException("해당 고양이 ID에 연결된 디바이스를 찾을 수 없습니다. ID: " + catId));

        List<Schedule> schedules = scheduleRepository.findByDeviceId(device.getId());

        return schedules.stream()
                .map(schedule -> new ScheduleResponseDto(
                        schedule.getId(),
                        schedule.getScheduledTime(),
                        schedule.getScheduledAmount(),
                        schedule.getIsActive()
                ))
                .collect(Collectors.toList());
    }

    /**
     * 예약 스케줄 수정 로직 (시간, 양 변경)
     *
     * @param scheduleId 수정할 스케줄 ID (Primary Key)
     * @param request 수정 요청 데이터 (시간, 양)
     */
    @Transactional
    public void updateSchedule(Long scheduleId, ScheduleRequestDto request) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 스케줄을 찾을 수 없습니다. ID: " + scheduleId));

        // 시간과 양 업데이트
        schedule.setScheduledTime(request.getScheduledTime());
        schedule.setScheduledAmount(request.getScheduledAmount());

        // 저장 후 업데이트 완료 처리
        scheduleRepository.save(schedule);
    }

    /**
     * 예약 스케줄 활성화 여부 토글 로직
     *
     * @param scheduleId 수정할 스케줄 ID (Primary Key)
     */
    @Transactional
    public void toggleScheduleActive(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 스케줄을 찾을 수 없습니다. ID: " + scheduleId));

        // 활성화 여부 토글 처리 (true <-> false)
        schedule.setIsActive(!schedule.getIsActive());

        // 저장 후 업데이트 완료 처리
        scheduleRepository.save(schedule);
    }

    /**
     * 예약 스케줄 삭제 로직
     *
     * @param scheduleId 삭제할 스케줄 ID (Primary Key)
     */
    @Transactional
    public void deleteSchedule(Long scheduleId) {
        if (!scheduleRepository.existsById(scheduleId)) {
            throw new IllegalArgumentException("해당 ID의 스케줄을 찾을 수 없습니다. ID: " + scheduleId);
        }
        scheduleRepository.deleteById(scheduleId);
    }

    /**
     * 스케줄 ID로 해당 고양이 ID를 조회하는 메서드
     */
    public Long getCatIdByScheduleId(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 스케줄을 찾을 수 없습니다. ID: " + scheduleId));
        return schedule.getDevice().getCat().getId();
    }
}
