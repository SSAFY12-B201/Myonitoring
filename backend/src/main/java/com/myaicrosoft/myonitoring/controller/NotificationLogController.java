package com.myaicrosoft.myonitoring.controller;

import com.myaicrosoft.myonitoring.dto.NotificationLogResponse;
import com.myaicrosoft.myonitoring.service.NotificationLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * NotificationLogController
 * - 알림 로그 관련 요청을 처리하는 컨트롤러 클래스
 */
@RestController
@RequestMapping("/alert-logs")
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
public class NotificationLogController {

    private final NotificationLogService notificationLogService;

    /**
     * 특정 고양이의 모든 알림 로그 데이터를 날짜별로 그룹화하고 내림차순으로 반환합니다.
     *
     * @param catPk 고양이 ID (Primary Key)
     * @return 날짜별로 그룹화된 알림 로그 데이터 (날짜와 시간 내림차순 정렬)
     */
    @GetMapping("/{cat_pk}")
    public ResponseEntity<Map<LocalDate, List<NotificationLogResponse>>> getLogsGroupedByDate(@PathVariable("cat_pk") Long catPk) {
        Map<LocalDate, List<NotificationLogResponse>> groupedLogs = notificationLogService.getLogsGroupedByDate(catPk);
        return ResponseEntity.ok(groupedLogs);
    }
}
