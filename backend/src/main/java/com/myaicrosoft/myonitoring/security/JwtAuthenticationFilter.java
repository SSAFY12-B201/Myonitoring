package com.myaicrosoft.myonitoring.security;

import com.myaicrosoft.myonitoring.util.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String jwt = resolveToken(request);

            // 로깅 추가
            log.info("Request URL : {}", request.getRequestURL());
            log.info("Extracted JWT: {}", jwt);

            if (StringUtils.hasText(jwt)) {
                if(jwtProvider.validateToken(jwt)) {
                    Authentication authentication = jwtProvider.getAuthentication(jwt);

                    if(authentication != null) {
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        log.info("Successfully authenticated user: {}", authentication.getName());
                    } else {
                        log.warn("Authentication is null after token validation");
                    }
                } else {
                    log.warn("Token validation failed for token: {}", jwt);
                }
            }
        } catch (Exception e) {
            log.error("Error in JWT authentication", e);
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
} 