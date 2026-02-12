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
                    config.setExposedHeaders(Collections.singletonList("Set-Cookie"));
                    config.setAllowCredentials(true);
                    config.setAllowedHeaders(Collections.singletonList("*"));
                    return config;
                }))

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/user/login", "/api/user/join", "/api/process-user",
                                "/api/characters/ranking", "/api/cv/ranking","/api/lines/active").permitAll()

                        .requestMatchers("/api/characters/*/like").authenticated()
                        .requestMatchers("/api/admin/**", "/api/AdUserLi/**", "/api/AdCuSeAsk/**","/api/AdFAQ/**").hasRole("ADMIN")
                        .requestMatchers("/api/user/**").hasRole("USER")
                        .anyRequest().authenticated()
                )

                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .ignoringRequestMatchers(
                                "/api/user/login",
                                "/api/user/join",
                                "/api/AdUserLi/**",
                                "/api/AdCuSeAsk/**",
                                "/api/AdFAQ/**",
                                "/api/user/**",
                                "/api/process-user",
                                "/api/characters/ranking",
                                "/api/cv/ranking",
                                "/api/lines/active",
                                "/api/characters/*/like"
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
                .formLogin(AbstractHttpConfigurer::disable);

        return http.build();
    }
}