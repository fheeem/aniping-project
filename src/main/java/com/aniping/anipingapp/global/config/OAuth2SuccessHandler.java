package com.aniping.anipingapp.global.config;

import com.aniping.anipingapp.user.entity.UserEntity;
import com.aniping.anipingapp.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = (String) oAuth2User.getAttributes().get("email");
        String name = (String) oAuth2User.getAttributes().get("name");

        Optional<UserEntity> userOptional = userRepository.findByLoginId(email);

        if (userOptional.isPresent()) {
            // 1. 기존 회원: 로그인 처리
            UserEntity user = userOptional.get();
            
            // 소셜 로그인으로 가입한 계정이 맞는지 확인 (선택 사항)
            // if (user.getSocial() == UserEntity.Social.LOCAL) { ... }

            // SecurityContext 갱신 (OAuth2User -> UserEntity 기반 Authentication)
            Authentication newAuth = new UsernamePasswordAuthenticationToken(
                    user.getLoginId(),
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getGrade().name()))
            );
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(newAuth);
            SecurityContextHolder.setContext(context);
            
            // 세션 저장
            securityContextRepository.saveContext(context, request, response);
            
            // 홈으로 리다이렉트
            response.sendRedirect("http://localhost:5173/");
        } else {
            // 2. 신규 회원: 추가 정보 입력 페이지로 리다이렉트
            // 이메일과 이름을 쿼리 파라미터로 전달 (보안상 세션이나 임시 토큰 사용 권장하지만 간단하게 구현)
            String targetUrl = "http://localhost:5173/social-join?email=" + email + "&name=" + name + "&social=GOOGLE";
            response.sendRedirect(targetUrl);
        }
    }
}
