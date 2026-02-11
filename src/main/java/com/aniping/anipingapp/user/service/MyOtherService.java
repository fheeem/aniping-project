package com.aniping.anipingapp.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// 예시: 다른 서비스 클래스에서 사용하는 방법
@Service
@RequiredArgsConstructor
public class MyOtherService {

    private final AwsCheckService awsCheckService;

    public void someMethod() {
        String bucketName = "anipingapp-imagestorege";
        String folderPath = "aniCha/";

        List<String> files = awsCheckService.listFiles(bucketName, folderPath);

        // 이제 'files' 리스트에는 "aniCha/이미지1.jpg", "aniCha/이미지2.png" 와 같은
        // 파일 경로들이 담겨 있습니다.
    }
}