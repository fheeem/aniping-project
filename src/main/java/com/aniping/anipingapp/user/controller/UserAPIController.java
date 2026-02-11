package com.aniping.anipingapp.user.controller;

import com.aniping.anipingapp.user.dto.UserJoinDto;
import com.aniping.anipingapp.user.dto.UserLoginDto;
import com.aniping.anipingapp.user.entity.UserEntity; // UserEntity 임포트
import com.aniping.anipingapp.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping; // GetMapping 임포트
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
//localhost:8080//api/user/**
@RequestMapping("/api/user")
@RestController
@RequiredArgsConstructor
public class UserAPIController {

    private final UserService userService;

    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody UserJoinDto userJoinDto) {
        try {
            userService.join(userJoinDto);
            return ResponseEntity.ok("회원가입 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // 서버 로그에 에러 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserEntity> login(@RequestBody UserLoginDto userLoginDto, HttpServletRequest request) { // 1. request로 변경

        // 2. userService.login 내에서 이미 세션 무효화 및 새 세션 생성이 일어남
        if (userService.login(userLoginDto, request)) {

            // 3. 새로 생성된 세션에서 유저 정보 가져오기
            HttpSession session = request.getSession(false);
            UserEntity loggedInUser = (UserEntity) session.getAttribute("user");

            // 보안을 위해 민감 정보 제외
            if (loggedInUser != null) {
                loggedInUser.setPassword(null);
                loggedInUser.setPhoneNumber(null);
                loggedInUser.setName(null);
            }

            return ResponseEntity.ok(loggedInUser);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(HttpSession session) {
        UserEntity user = (UserEntity) session.getAttribute("user");
        if (user != null) {
            // 보안을 위해 비밀번호는 제외하고 반환
            user.setPassword(null);
            return ResponseEntity.ok(user); // 로그인된 사용자 정보 반환
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }
    }
}
