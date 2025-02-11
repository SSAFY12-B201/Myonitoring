package com.myaicrosoft.myonitoring.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
public class TestController {
   @GetMapping("/hello")
   public Map<String, String> hello() {
       Map<String, String> response = new HashMap<>();
       response.put("message", "스프링부트에 오신걸 환영합니다! (test)");
       return response;
   }
}
