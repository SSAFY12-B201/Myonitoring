package com.myaicrosoft.myonitoring.controller;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.dto.DataCollectionRequest;
import com.myaicrosoft.myonitoring.service.DataCollectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 임베디드 기기로부터 데이터를 수집하여 저장하는 컨트롤러 클래스
 */
@RestController
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
@RequestMapping("/data-collection") // 데이터 수집 관련 API의 엔드포인트 설정
public class DataCollectionController {

    private final DataCollectionService dataCollectionService;

    /**
     * 데이터를 수집하고 저장하는 API
     *
     * @param request 수집된 데이터 요청 객체 (DTO)
     * @return HTTP 201 상태 코드 반환
     */
    @PostMapping
    public ResponseEntity<Void> collectData(@RequestBody DataCollectionRequest request) {
        dataCollectionService.saveData(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
