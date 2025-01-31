package com.myaicrosoft.myonitoring.service;

import com.myaicrosoft.myonitoring.model.dto.TokenDto;
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

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;

    @Override
    @Transactional
    public TokenDto authenticate(String code) {
        // 1. 카카오 액세스 토큰 + ID 토큰 받기
        String kakaoTokens = getKakaoTokens(code);
        Map<String, String> tokens = parseKakaoTokens(kakaoTokens);
        String idToken = tokens.get("id_token");

        // 2. ID 토큰 검증 및 사용자 정보 추출
        Map<String, Object> claims = verifyAndExtractClaims(idToken);
        String email = claims.get("email").toString();

        // 3. 사용자 정보 저장 또는 업데이트
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> userService.registerUser(email, User.Provider.KAKAO));

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

        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://kauth.kakao.com/oauth/token",
                request,
                String.class
        );

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        }
        throw new RuntimeException("Failed to get Kakao tokens");
    }

    private Map<String, String> parseKakaoTokens(String tokensJson) {
        // TODO: JSON 파싱 구현
        // 실제 구현에서는 ObjectMapper를 사용하여 JSON을 파싱해야 합니다.
        return Map.of(
                "access_token", "dummy_access_token",
                "id_token", "dummy_id_token",
                "refresh_token", "dummy_refresh_token"
        );
    }

    private Map<String, Object> verifyAndExtractClaims(String idToken) {
        // TODO: JWT 검증 및 클레임 추출 구현
        // 실제 구현에서는 JWT 라이브러리를 사용하여 토큰을 검증하고 클레임을 추출해야 합니다.
        return Map.of(
                "email", "user@example.com"
        );
    }

    @Override
    @Transactional
    public TokenDto refreshToken(String refreshToken) {
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