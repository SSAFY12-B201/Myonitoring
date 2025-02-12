package com.myaicrosoft.myonitoring;

import com.myaicrosoft.myonitoring.model.dto.TokenDto;
import com.myaicrosoft.myonitoring.model.entity.User;
import com.myaicrosoft.myonitoring.repository.UserRepository;
import com.myaicrosoft.myonitoring.util.JwtProvider;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Profile;

/**
 * Spring Boot 애플리케이션의 진입점 클래스
 * - @EnableScheduling: 스케줄링 작업을 활성화합니다.
 */
@SpringBootApplication
@EnableScheduling // 스케줄링 활성화
public class MyonitoringApplication {

	public static void main(String[] args) {
		SpringApplication.run(MyonitoringApplication.class, args);
	}

	@Bean
//	@Profile("dev") // 개발 환경에서만 실행
	public CommandLineRunner initAdminUser(
			UserRepository userRepository,
			JwtProvider jwtProvider,
			@Value("${admin.email:admin@myaicrosoft.com}") String adminEmail,
			@Value("${admin.nickname:관리자}") String adminNickname
	) {
		return args -> {
			// Admin 계정이 이미 존재하는지 확인
			if (!userRepository.existsByEmail(adminEmail)) {
				User adminUser = User.builder()
						.email(adminEmail)
						.nickname(adminNickname)
						.role(User.Role.ADMIN)
						.provider(User.Provider.KAKAO)
						.build();
				
				// Admin 계정 저장
				adminUser = userRepository.save(adminUser);
				
				// 토큰 생성
				TokenDto tokenDto = jwtProvider.generateTokenDto(adminUser);
				
				// Refresh Token을 DB에 저장
				adminUser.setRefreshToken(tokenDto.getRefreshToken());
				userRepository.save(adminUser);

				System.out.println("Admin account created successfully in development environment!");
				System.out.println("Email: " + adminEmail);
				System.out.println("Access Token: " + tokenDto.getAccessToken());
				System.out.println("Refresh Token: " + tokenDto.getRefreshToken());
			}
		};
	}
}
