package com.myaicrosoft.myonitoring.controller;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.service.IntakeService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.List;

/**
 * 섭취(Intake) 및 급여(Feeding) 데이터를 조회하는 컨트롤러 클래스
 */
@RestController
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
@RequestMapping("/intake") // "/api/intake" -> "/intake"로 수정
public class IntakeController {

    private final IntakeService intakeService;

    /**
     * 일간 누적 섭취량 조회 API
     *
     * @param catPk 고양이 ID (Primary Key)
     * @param day   조회할 날짜
     * @return 해당 날짜의 누적 섭취량 (BigDecimal)
     */
    @GetMapping("/{catPk}/day/cum")
    public ResponseEntity<BigDecimal> getDailyCumulativeIntake(
            @PathVariable Long catPk,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate day) {
        BigDecimal cumulativeIntake = intakeService.getDailyCumulativeIntake(catPk, day);
        return ResponseEntity.ok(cumulativeIntake);
    }

    /**
     * 주간 누적 섭취량 및 급여량 조회 API
     *
     * @param catPk     고양이 ID (Primary Key)
     * @param weekStart 주간 시작 날짜
     * @return 주간 누적 섭취량 및 급여량 데이터 (Map 형식)
     */
    @GetMapping("/{catPk}/week/cum")
    public ResponseEntity<Map<String, Map<String, Integer>>> getWeeklyCumulativeData(
            @PathVariable("catPk") Long catPk,
            @RequestParam("week_start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
        Map<String, Map<String, Integer>> weeklyData = intakeService.getWeeklyCumulativeData(catPk, weekStart);
        return ResponseEntity.ok(weeklyData);
    }

    /**
     * 일간 급여 및 섭취 상세 조회 API
     *
     * @param catPk 고양이 ID (Primary Key)
     * @param day   조회할 날짜
     * @return 급여 및 섭취 상세 데이터 리스트 (List 형식)
     */
    @GetMapping("/{catPk}/detail")
    public ResponseEntity<List<Map<String, Object>>> getDailyFeedingAndIntakeDetails(
            @PathVariable("catPk") Long catPk,
            @RequestParam("day") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate day) {
        List<Map<String, Object>> details = intakeService.getDailyFeedingAndIntakeDetails(catPk, day);
        return ResponseEntity.ok(details);
    }
}
