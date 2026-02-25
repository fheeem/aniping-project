package com.aniping.anipingapp.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final StringRedisTemplate redisTemplate;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int CODE_LENGTH = 8;
    private static final long EXPIRATION_TIME = 5; // 5분

    // 인증 코드 생성
    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

    // 이메일 발송 및 Redis 저장
    public void sendVerificationEmail(String toEmail) {
        String code = generateVerificationCode();

        // Redis에 저장 (Key: email, Value: code, TTL: 5분)
        redisTemplate.opsForValue().set(toEmail, code, EXPIRATION_TIME, TimeUnit.MINUTES);

        // 이메일 전송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[애니핑] 회원가입 이메일 인증 코드");
        message.setText("인증 코드: " + code + "\n\n5분 이내에 입력해주세요.");
        
        mailSender.send(message);
    }

    // 인증 코드 검증
    public boolean verifyCode(String email, String code) {
        String storedCode = redisTemplate.opsForValue().get(email);
        
        if (storedCode == null) {
            throw new IllegalArgumentException("인증 코드가 만료되었거나 존재하지 않습니다. 재발급해주세요.");
        }
        
        if (storedCode.equals(code)) {
            redisTemplate.delete(email); // 인증 성공 시 코드 삭제
            return true;
        } else {
            return false;
        }
    }
}
