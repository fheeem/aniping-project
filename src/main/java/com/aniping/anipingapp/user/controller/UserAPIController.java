package com.aniping.anipingapp.user.controller;

import com.aniping.anipingapp.user.dto.UserJoinDto;
import com.aniping.anipingapp.user.dto.UserLoginDto;
import com.aniping.anipingapp.user.entity.UserEntity;
import com.aniping.anipingapp.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<UserEntity> login(@RequestBody UserLoginDto userLoginDto, HttpServletRequest request) {
        if (userService.login(userLoginDto, request)) {
            HttpSession session = request.getSession(false);
            UserEntity loggedInUser = (UserEntity) session.getAttribute("user");
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
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }
    }

    @GetMapping("/check-id")
    public ResponseEntity<Boolean> checkLoginIdDuplicate(@RequestParam String loginId) {
        return ResponseEntity.ok(userService.checkLoginIdDuplicate(loginId));
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<Boolean> checkNicknameDuplicate(@RequestParam String nickname) {
        return ResponseEntity.ok(userService.checkNicknameDuplicate(nickname));
    }
}
