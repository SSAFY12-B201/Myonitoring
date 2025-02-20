package com.myaicrosoft.myonitoring.util;

import com.myaicrosoft.myonitoring.model.dto.TokenDto;
import com.myaicrosoft.myonitoring.model.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Collections;
import java.util.Date;

@Slf4j
@Component
public class JwtProvider {

    private final Key key;
    private final long accessTokenValidityInMilliseconds;
    private final long refreshTokenValidityInMilliseconds;
    private final long adminAccessTokenValidityInMilliseconds = 365L * 24 * 60 * 60 * 1000; // 1년

    public JwtProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-validity-in-seconds}") String accessTokenValidityInSeconds,
            @Value("${jwt.refresh-token-validity-in-seconds}") String refreshTokenValidityInSeconds) {

        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);

        try {
            this.accessTokenValidityInMilliseconds = Long.parseLong(accessTokenValidityInSeconds) * 1000;
            this.refreshTokenValidityInMilliseconds = Long.parseLong(refreshTokenValidityInSeconds) * 1000;
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid token validity duration", e);
        }

        log.info("JWT Provider initialized with key length: {}", keyBytes.length);
    }

    public TokenDto generateTokenDto(User user) {
        long now = (new Date()).getTime();
        // 관리자인 경우 1년, 아닌 경우 기본 유효기간 적용
        // long tokenValidity = user.getRole() == User.Role.ADMIN ?
        //         adminAccessTokenValidityInMilliseconds : accessTokenValidityInMilliseconds;
        // Date accessTokenExpiresIn = new Date(now + tokenValidity);
        
        // 임시로 1년 유효기간 적용
        Date accessTokenExpiresIn = new Date(now + adminAccessTokenValidityInMilliseconds);
        Date refreshTokenExpiresIn = new Date(now + refreshTokenValidityInMilliseconds);

        log.info("Generating token for user: {} with role: {}", user.getEmail(), user.getRole());

        // Access Token 생성
        String accessToken = Jwts.builder()
                .setSubject(user.getEmail())
                .claim("id", user.getId())
                .claim("role", user.getRole().name())  // ADMIN or USER
                .claim("authorities", Collections.singleton("ROLE_" + user.getRole().name()))  // ROLE_ADMIN or ROLE_USER
                .setIssuedAt(new Date(now))
                .setExpiration(accessTokenExpiresIn)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();

        // Refresh Token 생성
        String refreshToken = Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(now))
                .setExpiration(refreshTokenExpiresIn)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();

        log.info("Token generated successfully for user: {}", user.getEmail());

        return TokenDto.builder()
                .grantType("Bearer")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .accessTokenExpiresIn(accessTokenExpiresIn.getTime())
                .build();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);

        if (claims.get("role") == null) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        String role = claims.get("role", String.class);
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

        log.info("Token authentication successful for user: {} with role: {}", claims.getSubject(), role);

        return new UsernamePasswordAuthenticationToken(claims.getSubject(), "", Collections.singleton(authority));
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = parseClaims(token);
        return claims.get("id", Long.class);
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            log.info("Token validated successfully for user: {}", claims.getSubject());
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.error("잘못된 JWT 서명입니다: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("만료된 JWT 토큰입니다: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("지원되지 않는 JWT 토큰입니다: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT 토큰이 잘못되었습니다: {}", e.getMessage());
        }
        return false;
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    public String generateAccessToken(User user) {
        long now = (new Date()).getTime();
        Date accessTokenExpiresIn = new Date(now + accessTokenValidityInMilliseconds);

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("id", user.getId())
                .claim("role", user.getRole().name())
                .claim("authorities", Collections.singleton("ROLE_" + user.getRole().name()))
                .setIssuedAt(new Date(now))
                .setExpiration(accessTokenExpiresIn)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public long getAccessTokenExpirationTime() {
        return accessTokenValidityInMilliseconds;
    }
}