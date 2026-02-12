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
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/user/login", "/api/user/join", "/api/process-user", "/api/user/check-id", "/api/user/check-nickname").permitAll()
                        
                        // 내 정보 조회는 인증된 사용자 누구나 가능 (USER, ADMIN 모두)
                        .requestMatchers("/api/user/me").authenticated()

                        // 💡 보안 핵심: 아래 경로는 반드시 'ADMIN' 권한이 있는 세션만 접근 가능 (보안 유지!)
                        .requestMatchers("/api/admin/**", "/api/AdUserLi/**", "/api/AdCuSeAsk/**","/api/AdFAQ/**").hasRole("ADMIN")
                        .requestMatchers("/api/user/**").hasRole("USER")
                        .anyRequest().authenticated()
                )

                // 2. CSRF 예외 처리: 로그인, 회원가입 등 인증 전 POST 요청만 예외 처리
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .ignoringRequestMatchers(
                                "/api/user/login",
                                "/api/user/join",
                                "/api/process-user",
                                "/api/AdUserLi/**",
                                "/api/AdCuSeAsk/**",
                                "/api/AdFAQ/**",
                                "/api/user/**"
                        )
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
