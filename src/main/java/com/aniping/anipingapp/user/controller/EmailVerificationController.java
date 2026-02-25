package com.aniping.anipingapp.user.controller;

import com.aniping.anipingapp.user.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequestMapping("/api/email")
@RestController
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendVerificationEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        try {
            emailService.sendVerificationEmail(email);
            return ResponseEntity.ok("인증 코드가 발송되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 발송 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        
        try {
            boolean isVerified = emailService.verifyCode(email, code);
            if (isVerified) {
                return ResponseEntity.ok("인증되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증 코드가 일치하지 않습니다.");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.GONE).body(e.getMessage()); // 410 Gone: 만료됨
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("인증 처리 중 오류가 발생했습니다.");
        }
    }
}
