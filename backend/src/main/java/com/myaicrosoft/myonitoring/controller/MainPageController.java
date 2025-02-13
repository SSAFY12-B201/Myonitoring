package com.myaicrosoft.myonitoring.controller;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.service.MainPageService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

/**
 * 메인 페이지 데이터를 처리하는 컨트롤러 클래스
 */
@RestController
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
@RequestMapping("/main") // 메인 페이지 관련 API 엔드포인트 설정
public class MainPageController {

    private final MainPageService mainPageService;

    /**
     * 메인 페이지 데이터를 조회하는 API
     *
     * @param catPk 고양이 ID (Primary Key)
     * @param day   조회할 날짜 (YYYY-MM-DD 형식)
     * @return 메인 페이지에 필요한 데이터 (JSON 형식)
     */
    @GetMapping("/{catPk}")
    public ResponseEntity<Map<String, Object>> getMainPageData(
            @PathVariable("catPk") Long catPk,
            @RequestParam("day") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate day) {
        Map<String, Object> result = mainPageService.getMainPageData(catPk, day);
        return ResponseEntity.ok(result);
    }
}
