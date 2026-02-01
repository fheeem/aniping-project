package com.aniping.anipingapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

// @RestController: 이 클래스가 RESTful API의 엔드포인트(API 집합)임을 나타냅니다.
// 모든 메서드는 기본적으로 @ResponseBody가 적용되어 JSON과 같은 데이터 형태로 응답합니다.
@RestController
@RequestMapping("/api") // 이 클래스의 모든 메서드는 /api 경로 아래에 매핑됩니다.
public class ProcessUserController {

    // @PostMapping: HTTP POST 요청을 처리하는 메서드임을 나타냅니다.
    // "/api/process-user" 경로의 POST 요청을 이 메서드가 받게 됩니다.
    @PostMapping("/process-user")
    public ResponseEntity<?> processUserData(@RequestBody UserRequest requestData) {
        // @RequestBody: 요청의 본문(body)에 담겨 온 JSON 데이터를 UserRequest 객체로 변환해줍니다.
        // 프론트에서 보낸 JSON의 key와 UserRequest 클래스의 필드명이 일치해야 합니다.

        // --- 1. 프론트엔드로부터 데이터 수신 확인 ---
        // System.out.println을 통해 프론트에서 보낸 데이터가 백엔드에 잘 도착했는지 확인합니다.
        System.out.println("Received user data from frontend: " + requestData.toString());

        // --- 2. 데이터 처리 (DB Select 작업 시뮬레이션) ---
        // 실제로는 여기서 DB에 연결하고, 받은 userId로 SELECT 쿼리를 실행합니다.
        // 예: User a = userRepository.findById(requestData.getUserId());
        // 여기서는 DB가 없으므로, 받은 데이터를 가공하여 새로운 정보를 추가하는 척 합니다.
        String processedMessage = "User '" + requestData.getUserName() + "' (ID: " + requestData.getUserId() + ") processed successfully.";

        // --- 3. 프론트엔드에 반환할 데이터 생성 ---
        // 프론트엔드에 돌려줄 결과 데이터를 Map이나 DTO(Data Transfer Object)에 담습니다.
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("status", "SUCCESS");
        responseData.put("message", processedMessage);
        responseData.put("processedAt", LocalDateTime.now().toString());
        responseData.put("originalRequest", requestData); // 프론트가 보냈던 데이터를 다시 보내줄 수도 있습니다.

        // --- 4. JSON 데이터 응답 ---
        // ResponseEntity.ok()는 HTTP 상태 코드 200 (성공)과 함께,
        // responseData 객체를 JSON 형태로 변환하여 응답 본문에 담아 반환합니다.
        // 백엔드는 "데이터를 돌려줄 뿐", 페이지 이동(리디렉션)에 대해서는 전혀 관여하지 않습니다.
        return ResponseEntity.ok(responseData);
    }

    // JSON 데이터를 받기 위한 간단한 DTO(Data Transfer Object) 클래스
    // Lombok의 @Data 어노테이션을 사용하면 더 편리합니다.
    public static class UserRequest {
        private String userId;
        private String userName;

        // Getter, Setter, toString() ...
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }

        @Override
        public String toString() {
            return "UserRequest{" + "userId='" + userId + '\'' + ", userName='" + userName + '\'' + '}';
        }
    }
}
