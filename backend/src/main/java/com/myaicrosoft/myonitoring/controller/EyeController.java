package com.myaicrosoft.myonitoring.controller;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.service.EyeService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * 안구 질환(Eye Disease) 데이터를 처리하는 컨트롤러 클래스
 */
@RestController
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
@RequestMapping("/eye") // "/api/eye" -> "/eye"로 수정
public class EyeController {

    private final EyeService eyeService;

    /**
     * 특정 고양이의 특정 날짜 안구 질환 데이터를 조회하는 API
     *
     * @param catPk 고양이 ID (Primary Key)
     * @param day   조회할 날짜
     * @return 안구 질환 데이터 또는 메시지 반환
     */
    @GetMapping("/{catPk}/detail")
    public ResponseEntity<Object> getEyeDiseaseDetails(
            @PathVariable("catPk") Long catPk,
            @RequestParam("day") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate day) {
        Object result = eyeService.getEyeDiseaseDetails(catPk, day);
        return ResponseEntity.ok(result);
    }
}
