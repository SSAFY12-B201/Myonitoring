package com.myaicrosoft.myonitoring.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myaicrosoft.myonitoring.model.dto.TokenDto;
import com.myaicrosoft.myonitoring.model.dto.UserRegistrationDto;
import com.myaicrosoft.myonitoring.model.entity.User;
import com.myaicrosoft.myonitoring.repository.UserRepository;
import com.myaicrosoft.myonitoring.util.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("kakao")
@RequiredArgsConstructor
public class KakaoAuthService implements OAuth2AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;

    @Override
    @Transactional
    public Map<String, Object> authenticate(String code) {
        if (code == null || code.isEmpty()) {
            throw new IllegalArgumentException("Authorization code cannot be null or empty");
        }

        // 카카오 토큰 받기
        String tokensJson = getKakaoTokens(code);
        Map<String, String> tokens = parseKakaoTokens(tokensJson);
        String kakaoAccessToken = tokens.get("access_token");

        // 카카오 사용자 정보 받기
        Map<String, Object> userInfo = getKakaoUserInfo(kakaoAccessToken);
        String email = extractEmail(userInfo);

        // 이메일로 사용자 찾기
        User existingUser = userRepository.findByEmail(email).orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("auth_token", kakaoAccessToken);
        response.put("email", email);

        if (existingUser != null) {
            // 기존 회원인 경우
            if (existingUser.getProvider() != User.Provider.KAKAO) {
                throw new RuntimeException("This email is already registered with different provider: " + existingUser.getProvider());
            }

            // 프로필이 완성되지 않은 경우
            if (!existingUser.isProfileCompleted()) {
                Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
                Map<String, Object> properties = (Map<String, Object>) userInfo.get("properties");

                response.put("is_registered", false);
                response.put("registration_info", Map.of(
                        "email", email,
                        "suggested_nickname", properties != null ? properties.get("nickname") : email.split("@")[0],
                        "required_fields", List.of("nickname", "address", "phoneNumber")
                ));
                return response;
            }

            // 프로필이 완성된 경우 로그인 처리
            TokenDto tokenDto = jwtProvider.generateTokenDto(existingUser);
            existingUser.setRefreshToken(tokenDto.getRefreshToken());
            userRepository.save(existingUser);

            response.put("is_registered", true);
            response.put("token", tokenDto);
        } else {
            // 신규 회원인 경우 기본 정보만 저장
            Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
            Map<String, Object> properties = (Map<String, Object>) userInfo.get("properties");

            // 기본 사용자 생성
            User newUser = User.builder()
                    .email(email)
                    .provider(User.Provider.KAKAO)
                    .role(User.Role.USER)
                    .isProfileCompleted(false)
                    .build();

            // JWT 토큰 생성 및 저장
            TokenDto tokenDto = jwtProvider.generateTokenDto(newUser);
            newUser.setRefreshToken(tokenDto.getRefreshToken());
            userRepository.save(newUser);

            response.put("is_registered", false);
            response.put("registration_info", Map.of(
                    "email", email,
                    "suggested_nickname", properties != null ? properties.get("nickname") : email.split("@")[0],
                    "required_fields", List.of("nickname", "address", "phoneNumber")
            ));
        }

        return response;
    }

    @Override
    @Transactional
    public TokenDto register(String authToken, UserRegistrationDto registrationDto) {
        if (authToken == null || authToken.isEmpty()) {
            throw new IllegalArgumentException("Auth token cannot be null or empty");
        }

        // 카카오 사용자 정보 다시 확인
        Map<String, Object> userInfo = getKakaoUserInfo(authToken);
        String email = extractEmail(userInfo);

        // 이메일로 사용자 찾기
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found. Please authenticate first."));

        if (user.isProfileCompleted()) {
            throw new RuntimeException("User profile is already completed");
        }

        // 추가 정보 업데이트
        user.setNickname(registrationDto.getNickname());
        user.setAddress(registrationDto.getAddress());
        user.setPhoneNumber(registrationDto.getPhoneNumber());
        user.setProfileCompleted(true);

        userRepository.save(user);

        // 기존 토큰 재사용 (이미 저장되어 있음)
        return TokenDto.builder()
                .grantType("Bearer")
                .accessToken(jwtProvider.generateAccessToken(user))
                .accessTokenExpiresIn(jwtProvider.getAccessTokenExpirationTime())
                .refreshToken(user.getRefreshToken())
                .build();
    }

    private String getKakaoTokens(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://kauth.kakao.com/oauth/token",
                    request,
                    String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            }
            throw new RuntimeException("Failed to get Kakao tokens: " + response.getStatusCode());
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Failed to get Kakao tokens: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
        }
    }

    private Map<String, String> parseKakaoTokens(String tokensJson) {
        try {
            return objectMapper.readValue(tokensJson, Map.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse Kakao tokens: " + e.getMessage(), e);
        }
    }

    private Map<String, Object> getKakaoUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    "https://kapi.kakao.com/v2/user/me",
                    HttpMethod.GET,
                    request,
                    String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return objectMapper.readValue(response.getBody(), Map.class);
            }
            throw new RuntimeException("Failed to get Kakao user info: " + response.getStatusCode());
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Failed to get Kakao user info: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse Kakao user info: " + e.getMessage(), e);
        }
    }

    private String extractEmail(Map<String, Object> userInfo) {
        try {
            Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
            if (kakaoAccount == null) {
                throw new RuntimeException("Kakao account information not found");
            }
            Object email = kakaoAccount.get("email");
            if (email == null) {
                throw new RuntimeException("Email not found in Kakao account");
            }
            return email.toString();
        } catch (ClassCastException e) {
            throw new RuntimeException("Invalid Kakao user info format", e);
        }
    }

    @Override
    @Transactional
    public TokenDto refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new IllegalArgumentException("Refresh token cannot be null or empty");
        }

        // 1. Refresh Token 검증
        if (!jwtProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        // 2. 저장소에서 Refresh Token으로 사용자 찾기
        User user = userRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        // 3. 새로운 토큰 발급
        TokenDto tokenDto = jwtProvider.generateTokenDto(user);
        userService.updateRefreshToken(user.getEmail(), tokenDto.getRefreshToken());

        return tokenDto;
    }
} 