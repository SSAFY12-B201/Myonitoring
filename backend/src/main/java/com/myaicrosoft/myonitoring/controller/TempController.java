package com.myaicrosoft.myonitoring.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/temp")
public class TempController {

    @PostMapping("/schedule")
    public ResponseEntity<List<Map<String, Object>>> getSchedule(@RequestBody Map<String, String> request) {
        // 임시 응답 데이터 생성
        List<Map<String, Object>> response = new ArrayList<>();
        
        Map<String, Object> schedule1 = new HashMap<>();
        schedule1.put("time", "08:00:00");
        schedule1.put("amount", 25);
        
        Map<String, Object> schedule2 = new HashMap<>();
        schedule2.put("time", "12:00:00");
        schedule2.put("amount", 30);
        
        response.add(schedule1);
        response.add(schedule2);
        
        return ResponseEntity.ok(response);
    }
} 