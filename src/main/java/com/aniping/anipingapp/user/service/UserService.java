package com.aniping.anipingapp.user.service;

import com.aniping.anipingapp.user.dto.UserJoinDto;
import com.aniping.anipingapp.user.dto.UserLoginDto;
import com.aniping.anipingapp.user.entity.UserEntity;
import com.aniping.anipingapp.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserEntity join(UserJoinDto userJoinDto) {
        // ID 중복 검사
        if (userRepository.existsByLoginId(userJoinDto.getLoginId())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        // 닉네임 중복 검사
        if (userRepository.existsByNickname(userJoinDto.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        String encodedPassword = passwordEncoder.encode(userJoinDto.getPassword());
        UserEntity userEntity = userJoinDto.toEntity(encodedPassword);

        return userRepository.save(userEntity);
    }

    public boolean login(UserLoginDto userLoginDto, HttpServletRequest request) {
        System.out.println("로그인 시도 ID: " + userLoginDto.getLoginId());

        UserEntity user = userRepository.findByLoginId(userLoginDto.getLoginId())
                .orElse(null);

        if (user != null && passwordEncoder.matches(userLoginDto.getPassword(), user.getPassword())) {

            // 1. 세션 교체
            HttpSession session = request.getSession(false);
            if (session != null) session.invalidate();
            HttpSession newSession = request.getSession(true);
            newSession.setAttribute("user", user);

            // 2. 인증 객체 생성
            Authentication auth = new UsernamePasswordAuthenticationToken(
                    user.getLoginId(), null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getGrade().name()))
            );

            // 3. Context 생성 및 저장
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);

            // 4. 시큐리티가 세션을 찾을 수 있도록 세션에 직접 컨텍스트 주입
            newSession.setAttribute("SPRING_SECURITY_CONTEXT", context);

            return true;
        }

        return false;
    }

    // 중복 확인 메소드 추가
    public boolean checkLoginIdDuplicate(String loginId) {
        return userRepository.existsByLoginId(loginId);
    }

    public boolean checkNicknameDuplicate(String nickname) {
        return userRepository.existsByNickname(nickname);
    }
}
