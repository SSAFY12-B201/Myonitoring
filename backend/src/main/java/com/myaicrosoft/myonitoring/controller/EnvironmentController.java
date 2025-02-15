package com.myaicrosoft.myonitoring.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/env")
public class EnvironmentController {

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;

    @Value("${firebase.config.api-key}")
    private String firebaseApiKey;

    @Value("${firebase.config.auth-domain}")
    private String firebaseAuthDomain;

    @Value("${firebase.config.project-id}")
    private String firebaseProjectId;

    @Value("${firebase.config.storage-bucket}")
    private String firebaseStorageBucket;

    @Value("${firebase.config.messaging-sender-id}")
    private String firebaseMessagingSenderId;

    @Value("${firebase.config.app-id}")
    private String firebaseAppId;

    @Value("${firebase.config.vapid-key}")
    private String firebaseVapidKey;

    @Value("${firebase.config.measurement-id}")
    private String firebaseMeasurementId;

    @GetMapping("/oauth/kakao")
    public Map<String, String> getKakaoOAuthConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("KAKAO_REDIRECT_URI", kakaoRedirectUri);
        config.put("KAKAO_CLIENT_ID", kakaoClientId);
        
        return config;
    }

    @GetMapping("/firebase-config")
    public ResponseEntity<Map<String, String>> getFirebaseConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("apiKey", firebaseApiKey);
        config.put("authDomain", firebaseAuthDomain);
        config.put("projectId", firebaseProjectId);
        config.put("storageBucket", firebaseStorageBucket);
        config.put("messagingSenderId", firebaseMessagingSenderId);
        config.put("appId", firebaseAppId);
        config.put("vapidKey", firebaseVapidKey);
        config.put("measurementId", firebaseMeasurementId);

        return ResponseEntity.ok(config);
    }
} 