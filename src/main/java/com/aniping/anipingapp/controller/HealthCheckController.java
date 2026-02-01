package com.aniping.anipingapp.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.Collections;
import java.util.Map;

@RestController
public class HealthCheckController {

    @GetMapping("/api/health")
    public ResponseEntity<?> healthCheck(@RequestHeader(value = "Accept", required = false) String acceptHeader) {
        System.out.println("'/api/health' endpoint was called. Accept Header: " + acceptHeader);

        // 브라우저가 HTML을 기대하는 경우 (직접 주소창에 입력)
        if (acceptHeader != null && acceptHeader.contains("text/html")) {
            System.out.println("Browser access detected. Redirecting to frontend homepage.");
            // 5173 포트의 프론트엔드 홈페이지로 리디렉션
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://localhost:5173")).build();
        }

        // API 호출인 경우 (React 앱의 fetch 등)
        System.out.println("API call detected. Returning JSON.");
        return ResponseEntity.ok(Collections.singletonMap("status", "UP"));
    }
}
