package com.myaicrosoft.myonitoring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyonitoringApplication {

	public static void main(String[] args) {
		SpringApplication.run(MyonitoringApplication.class, args);
	}

}
package com.myaicrosoft.myonitoring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Spring Boot 애플리케이션의 진입점 클래스
 * - @EnableScheduling: 스케줄링 작업을 활성화합니다.
 */
@SpringBootApplication
@EnableScheduling // 스케줄링 활성화
public class MyonitoringApplication {

	public static void main(String[] args) {
		SpringApplication.run(MyonitoringPracJpaApplication.class, args);
	}
}
