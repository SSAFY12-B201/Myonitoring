package com.myaicrosoft.myonitoring.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/temp")
public class TempController {

    private final String EXTERNAL_API_URL = "http://192.168.30.34:8000";
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/schedule")
    public ResponseEntity<Void> getSchedule(@RequestBody Map<String, String> request) {
        // 외부 API로 보낼 데이터 생성
        List<Map<String, Object>> scheduleData = new ArrayList<>();
        
        Map<String, Object> schedule1 = new HashMap<>();
        schedule1.put("time", "08:00:00");
        schedule1.put("amount", 25);
        
        Map<String, Object> schedule2 = new HashMap<>();
        schedule2.put("time", "12:00:00");
        schedule2.put("amount", 30);
        
        scheduleData.add(schedule1);
        scheduleData.add(schedule2);

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // HTTP 요청 객체 생성
        HttpEntity<List<Map<String, Object>>> requestEntity = new HttpEntity<>(scheduleData, headers);

        // 외부 API로 POST 요청 전송
        restTemplate.postForEntity(EXTERNAL_API_URL, requestEntity, Void.class);
        
        // 200 OK 응답 반환
        return ResponseEntity.ok().build();
    }
}