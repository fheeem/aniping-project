package com.aniping.anipingapp.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
                    config.setAllowedMethods(Collections.singletonList("*"));
                    config.setAllowCredentials(true);
                    config.setAllowedHeaders(Collections.singletonList("*"));
                    return config;
                }))

                // CSRF 활성화 및 쿠키 설정
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        // 로그인, 회원가입 경로는 CSRF 검증에서 제외
                        .ignoringRequestMatchers("/api/user/login", "/api/user/join")
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/user/login", "/api/user/join").permitAll() // 로그인, 회원가입 경로는 모두 허용
                        .anyRequest().authenticated() // 나머지 요청은 인증 필요
                )
                .exceptionHandling(exception -> exception
                        .defaultAuthenticationEntryPointFor(
                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                                request -> request.getServletPath().startsWith("/api/")
                        )
                )
                .logout(logout -> logout
                        .logoutUrl("/api/user/logout")
                        .deleteCookies("JSESSIONID", "XSRF-TOKEN")
                        .invalidateHttpSession(true)
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpStatus.OK.value());
                        })
                )
                .formLogin(AbstractHttpConfigurer::disable); // 사용자 정의 로그인을 위해 Form Login 비활성화

        return http.build();
    }
}

