package com.myaicrosoft.myonitoring.service;

import com.myaicrosoft.myonitoring.dto.NotificationLogResponse;
import com.myaicrosoft.myonitoring.model.entity.NotificationLog;
import com.myaicrosoft.myonitoring.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * NotificationLogService
 * - 알림 로그 데이터를 처리하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
public class NotificationLogService {

    private final NotificationLogRepository notificationLogRepository;

    /**
     * 특정 고양이의 알림 로그 데이터를 날짜별로 그룹화하고 내림차순으로 정렬하여 반환합니다.
     *
     * @param catId 고양이 ID
     * @return 날짜별로 그룹화된 알림 로그 데이터 (날짜와 시간 내림차순 정렬)
     */
    public Map<LocalDate, List<NotificationLogResponse>> getLogsGroupedByDate(Long catId) {
        // 특정 고양이의 모든 알림 로그 데이터 조회 (날짜 및 시간 내림차순 정렬)
        List<NotificationLog> logs = notificationLogRepository.findByCatIdOrderByNotificationDateTimeDesc(catId);

        // 날짜별로 그룹화하고 DTO로 변환하여 반환
        return logs.stream()
                .collect(Collectors.groupingBy(
                        log -> log.getNotificationDateTime().toLocalDate(), // 날짜를 기준으로 그룹화
                        LinkedHashMap::new, // 순서를 유지하기 위해 LinkedHashMap 사용
                        Collectors.mapping(
                                log -> new NotificationLogResponse(
                                        log.getId(),
                                        log.getNotificationDateTime().toLocalTime().toString(), // 시간만 추출 (HH:mm:ss)
                                        log.getCategory(),
                                        log.getMessage()
                                ),
                                Collectors.toList()
                        )
                ));
    }
}
