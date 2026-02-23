package com.aniping.anipingapp.global.config;

import com.aniping.anipingapp.user.entity.UserEntity;
import com.aniping.anipingapp.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        
        String email = null;
        String name = null;
        String socialType = "GOOGLE"; // 기본값

        if (attributes.containsKey("kakao_account")) {
            // 카카오 로그인
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            email = (String) kakaoAccount.get("email");
            name = (String) profile.get("nickname");
            socialType = "KAKAO";
        } else {
            // 구글 로그인
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
        }

        Optional<UserEntity> userOptional = userRepository.findByLoginId(email);

        if (userOptional.isPresent()) {
            // 1. 기존 회원: 로그인 처리
            UserEntity user = userOptional.get();
            
            Authentication newAuth = new UsernamePasswordAuthenticationToken(
                    user.getLoginId(),
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getGrade().name()))
            );
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(newAuth);
            SecurityContextHolder.setContext(context);
            
            securityContextRepository.saveContext(context, request, response);
            
            response.sendRedirect("http://localhost:5173/");
        } else {
            // 2. 신규 회원: 추가 정보 입력 페이지로 리다이렉트
            // 한글 이름 등은 URL 인코딩 필수
            String encodedName = URLEncoder.encode(name, StandardCharsets.UTF_8);
            String targetUrl = "http://localhost:5173/social-join?email=" + email + "&name=" + encodedName + "&social=" + socialType;
            response.sendRedirect(targetUrl);
        }
    }
}
