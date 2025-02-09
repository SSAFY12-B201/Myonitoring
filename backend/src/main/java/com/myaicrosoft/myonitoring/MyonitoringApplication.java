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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;

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
	public CommandLineRunner initAdminUser(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			JwtProvider jwtProvider
	) {
		return args -> {
			String adminEmail = "admin@myaicrosoft.com";
			// Admin 계정이 이미 존재하는지 확인
			if (!userRepository.existsByEmail(adminEmail)) {
				User adminUser = User.builder()
						.email(adminEmail)
						.password(passwordEncoder.encode("b201_nyang")) // 비밀번호 암호화
						.nickname("관리자")
						.role(User.Role.ADMIN)
						.provider(User.Provider.LOCAL)
						.build();
				
				// Admin 계정 저장
				adminUser = userRepository.save(adminUser);
				
				// Authentication 객체 생성
				Authentication authentication = new UsernamePasswordAuthenticationToken(
					adminUser.getEmail(),
					null,
					Collections.singleton(new SimpleGrantedAuthority("ROLE_" + adminUser.getRole().name()))
				);
				
				// 토큰 생성
				TokenDto tokenDto = jwtProvider.generateTokenDto(authentication);
				
				// Refresh Token을 DB에 저장
				adminUser.setRefreshToken(tokenDto.getRefreshToken());
				userRepository.save(adminUser);

				System.out.println("Admin account created successfully!");
				System.out.println("Email: " + adminEmail);
				System.out.println("Password: b201_nyang");
				System.out.println("Access Token: " + tokenDto.getAccessToken());
				System.out.println("Refresh Token: " + tokenDto.getRefreshToken());
			}
		};
	}
}
