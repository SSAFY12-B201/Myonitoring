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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
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
    public TokenDto signIn(String code, UserRegistrationDto registrationDto) {
        if (code == null || code.isEmpty()) {
            throw new IllegalArgumentException("Authorization code cannot be null or empty");
        }

        // 1. 카카오 액세스 토큰 받기
        String kakaoTokenResponse = getKakaoTokens(code);
        Map<String, String> tokens = parseKakaoTokens(kakaoTokenResponse);
        String accessToken = tokens.get("access_token");

        if (accessToken == null || accessToken.isEmpty()) {
            throw new RuntimeException("Failed to get access token from Kakao");
        }

        // 2. 액세스 토큰으로 사용자 정보 가져오기
        Map<String, Object> userInfo = getKakaoUserInfo(accessToken);
        String email = extractEmail(userInfo);

        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Failed to get email from Kakao");
        }

        // 3. 이메일로 기존 회원 조회
        User user;
        boolean isNewUser = !userRepository.existsByEmail(email);
        
        if (isNewUser) {
            // 신규 회원인 경우 회원가입 처리
            if (registrationDto == null) {
                throw new IllegalArgumentException("Registration information is required for new users");
            }
            registrationDto.setEmail(email);
            user = userService.registerUser(registrationDto, User.Provider.KAKAO);
        } else {
            // 기존 회원인 경우 정보 조회
            user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            
            // 카카오로 가입한 사용자가 맞는지 확인
            if (user.getProvider() != User.Provider.KAKAO) {
                throw new RuntimeException("This email is already registered with different provider: " + user.getProvider());
            }
        }

        // 4. JWT 토큰 발급
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getEmail(),
                null,
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );

        TokenDto tokenDto = jwtProvider.generateTokenDto(authentication);
        userService.updateRefreshToken(user.getEmail(), tokenDto.getRefreshToken());

        return tokenDto;
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
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getEmail(),
                null,
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );

        TokenDto tokenDto = jwtProvider.generateTokenDto(authentication);
        userService.updateRefreshToken(user.getEmail(), tokenDto.getRefreshToken());

        return tokenDto;
    }
} 