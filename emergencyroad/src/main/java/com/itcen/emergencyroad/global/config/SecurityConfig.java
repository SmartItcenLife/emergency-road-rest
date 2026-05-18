package com.itcen.emergencyroad.global.config;

import com.itcen.emergencyroad.global.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(sm -> sm
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .cors(cors -> cors
            .configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            // 인증 없이 허용
            .requestMatchers(HttpMethod.POST,
                "/api/auth/signup",
                "/api/auth/login",
                "/api/auth/refresh").permitAll()
            .requestMatchers(HttpMethod.GET,
                "/api/auth/kakao").permitAll()

            // 병원/병상 조회 전체 비로그인 허용
            .requestMatchers("/api/hospitals/**").permitAll()

            // 게시글/댓글 작성·수정·삭제는 로그인 필요
            .requestMatchers(HttpMethod.POST,
                "/api/hospitals/*/posts",
                "/api/hospitals/*/posts/*/comments",
                "/api/hospitals/*/posts/*/like",
                "/api/hospitals/*/posts/*/comments/*/like").authenticated()
            .requestMatchers(HttpMethod.PUT,
                "/api/hospitals/*/posts/*",
                "/api/hospitals/*/posts/*/comments/*").authenticated()
            .requestMatchers(HttpMethod.DELETE,
                "/api/hospitals/*/posts/*",
                "/api/hospitals/*/posts/*/comments/*").authenticated()

            // 어드민(ADMIN 경로는 ROLE을 ADMIN 가진 경우에만 진입할 수 있도록 설정해두었습니다.)
            .requestMatchers("/api/admin/**").hasRole("ADMIN")

            // 나머지
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of(
        // React 개발으로 3000번 포트로 CORS 열어두었습니다.
        "http://localhost:3000"
    ));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", config);
    return source;
  }
}
