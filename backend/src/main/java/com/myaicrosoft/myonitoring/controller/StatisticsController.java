package com.myaicrosoft.myonitoring.controller;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.dto.StatisticsResponseDto;
import com.myaicrosoft.myonitoring.service.StatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * 통계 데이터(Statistics) 관련 요청을 처리하는 컨트롤러 클래스
 */
@RestController
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
@RequestMapping("/stats") // Statistics 관련 API의 기본 경로 설정
public class StatisticsController {

    private final StatisticsService statisticsService;

    /**
     * 통계 데이터 조회 API
     *
     * @param catPk 고양이 ID (Primary Key)
     * @param day   기준 날짜 (YYYY-MM-DD)
     * @return 통계 데이터 응답 DTO 반환
     */
    @GetMapping("/{catPk}")
    public ResponseEntity<StatisticsResponseDto> getStatistics(
            @PathVariable("catPk") Long catPk,
            @RequestParam("day") LocalDate day) {
        StatisticsResponseDto response = statisticsService.getStatistics(catPk, day);
        return ResponseEntity.ok(response);
    }
}
