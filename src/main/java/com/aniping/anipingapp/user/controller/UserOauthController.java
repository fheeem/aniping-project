package com.aniping.anipingapp.user.controller;

import com.aniping.anipingapp.user.dto.UserJoinDto;
import com.aniping.anipingapp.user.entity.UserEntity;
import com.aniping.anipingapp.user.service.UserOAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RequestMapping("/api/oauth")
@RestController
@RequiredArgsConstructor
public class UserOauthController {

    private final UserOAuthService userOAuthService;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    @PostMapping("/join")
    public ResponseEntity<?> socialJoin(@RequestBody Map<String, Object> requestData, HttpServletRequest request, HttpServletResponse response) {
        try {
            String email = (String) requestData.get("email");
            String name = (String) requestData.get("name");
            String nickname = (String) requestData.get("nickname");
            String phoneNumber = (String) requestData.get("phoneNumber");
            
            // age 처리: String으로 올 수도 있고 Integer로 올 수도 있음
            Object ageObj = requestData.get("age");
            Integer age = null;
            if (ageObj != null) {
                age = Integer.parseInt(String.valueOf(ageObj));
            }

            String favoriteAni = (String) requestData.get("favoriteAni");
            String socialStr = (String) requestData.get("social");
            UserEntity.Social social = UserEntity.Social.valueOf(socialStr);

            UserJoinDto joinDto = new UserJoinDto();
            joinDto.setLoginId(email);
            joinDto.setEmail(email);
            joinDto.setName(name);
            joinDto.setNickname(nickname);
            joinDto.setPhoneNumber(phoneNumber);
            joinDto.setAge(age); // Integer 타입으로 설정
            joinDto.setFavoriteAni(favoriteAni);

            UserEntity user = userOAuthService.socialJoin(joinDto, social);

            // 회원가입 후 자동 로그인 처리
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    user.getLoginId(),
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getGrade().name()))
            );
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, request, response);

            return ResponseEntity.ok("소셜 회원가입 및 로그인 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("소셜 회원가입 중 오류가 발생했습니다.");
        }
    }
}
