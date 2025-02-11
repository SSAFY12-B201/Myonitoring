package com.myaicrosoft.myonitoring.controller;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.dto.*;
import com.myaicrosoft.myonitoring.service.MedicalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 의료 기록(Medical) 관련 요청을 처리하는 컨트롤러 클래스
 */
@RestController
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
@RequestMapping("/medical") // Medical 관련 API의 기본 경로 설정
public class MedicalController {

    private final MedicalService medicalService;

    /**
     * 의료 기록 생성 API
     *
     * @param catPk 고양이 ID (Primary Key)
     * @param request 의료 기록 생성 요청 데이터 (DTO)
     * @return 생성된 의료 기록의 ID 반환
     */
    @PostMapping("/{catPk}")
    public ResponseEntity<Long> createMedicalRecord(
            @PathVariable("catPk") Long catPk,
            @RequestBody MedicalRequest request) {
        Long medicalId = medicalService.createMedicalRecord(catPk, request);
        return ResponseEntity.ok(medicalId);
    }

    /**
     * 특정 기간의 의료 기록 조회 API
     *
     * @param catPk 고양이 ID (Primary Key)
     * @param startDate 조회 시작 날짜 (YYYY-MM-DD)
     * @param endDate 조회 종료 날짜 (YYYY-MM-DD)
     * @return 의료 기록 리스트 반환 (DTO)
     */
    @GetMapping("/{catPk}")
    public ResponseEntity<List<MedicalResponseDto>> getMedicalRecords(
            @PathVariable("catPk") Long catPk,
            @RequestParam("start_date") LocalDate startDate,
            @RequestParam("end_date") LocalDate endDate) {
        List<MedicalResponseDto> records = medicalService.getMedicalRecords(catPk, startDate, endDate);
        return ResponseEntity.ok(records);
    }

    /**
     * 의료 기록 상세 조회 API
     *
     * @param medicalPk 의료 기록 ID (Primary Key)
     * @return 의료 기록 상세 정보 반환 (DTO)
     */
    @GetMapping("/detail/{medicalPk}")
    public ResponseEntity<MedicalDetailResponseDto> getMedicalRecordDetail(
            @PathVariable("medicalPk") Long medicalPk) {
        MedicalDetailResponseDto record = medicalService.getMedicalRecordDetail(medicalPk);
        return ResponseEntity.ok(record);
    }

    /**
     * 의료 기록 수정 API
     *
     * @param medicalPk 수정할 의료 기록 ID (Primary Key)
     * @param request 수정 요청 데이터 (DTO)
     * @return HTTP 상태 코드 반환
     */
    @PutMapping("/detail/{medicalPk}")
    public ResponseEntity<Void> updateMedicalRecord(
            @PathVariable("medicalPk") Long medicalPk,
            @RequestBody MedicalRequest request) {
        medicalService.updateMedicalRecord(medicalPk, request);
        return ResponseEntity.noContent().build();
    }

    /**
     * 의료 기록 삭제 API
     *
     * @param medicalPk 삭제할 의료 기록 ID (Primary Key)
     * @return HTTP 상태 코드 반환
     */
    @DeleteMapping("/detail/{medicalPk}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable("medicalPk") Long medicalPk) {
        medicalService.deleteMedicalRecord(medicalPk);
        return ResponseEntity.noContent().build();
    }
}
