package com.myaicrosoft.myonitoring.config;
// Firebase 설정을 위한 스프링 프레임워크 및 설정 관련 import
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

// Firebase 관련 import
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

// Java 표준 라이브러리 import
import java.io.IOException;

// 스프링 Bean 생명주기 관리를 위한 어노테이션 import
import jakarta.annotation.PostConstruct;

@Configuration
public class FirebaseConfig {
    /**
     * Firebase 초기화 메서드
     * 애플리케이션 시작 시 Firebase 서비스 인증 및 설정
     * 
     * @throws IOException 서비스 계정 키 파일 로딩 중 발생할 수 있는 예외
     */
    @PostConstruct
    public void initialize() {
        try {
            // 클래스패스에서 Firebase 서비스 계정 키 파일 로드
            ClassPathResource resource = new ClassPathResource("myonitoring-firebase-adminsdk-fbsvc-78c9791370.json");
            
            // Firebase 초기화 옵션 설정
            FirebaseOptions options = new FirebaseOptions.Builder()
                // 서비스 계정 인증 정보 로드
                .setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
                .build();
            
            // 이미 초기화된 Firebase 앱이 없을 경우에만 초기화
            if (FirebaseApp.getInstances().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (Exception e) {
            // 초기화 중 발생하는 모든 예외 처리
            e.printStackTrace();
        }
    }
}