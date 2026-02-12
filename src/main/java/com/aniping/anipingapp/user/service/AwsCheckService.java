package com.aniping.anipingapp.user.service;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.Bucket;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.S3Object;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AwsCheckService {

    private final S3Client s3Client;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${spring.cloud.aws.region.static}")
    private String region;

    public void checkConnection() {
        try {
            // 현재 계정에 있는 S3 버킷 리스트를 가져와 봅니다.
            List<Bucket> buckets = s3Client.listBuckets().buckets();
            System.out.println("연결 성공! 버킷 개수: " + buckets.size());
            for (Bucket bucket : buckets) {
                System.out.println("버킷 이름: " + bucket.name());
            }
        } catch (Exception e) {
            System.err.println("연결 실패: " + e.getMessage());
        }
    }

    // 모든 객체 URL을 파일로 저장하는 메소드
    public void saveAllObjectUrlsToFile(String outputFilePath) {
        System.out.println("S3 버킷(" + bucketName + ")의 모든 객체 URL 조회를 시작합니다...");
        
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputFilePath))) {
            String continuationToken = null;
            int count = 0;

            do {
                ListObjectsV2Request.Builder requestBuilder = ListObjectsV2Request.builder()
                        .bucket(bucketName)
                        .continuationToken(continuationToken);

                ListObjectsV2Response response = s3Client.listObjectsV2(requestBuilder.build());

                for (S3Object s3Object : response.contents()) {
                    String key = s3Object.key();
                    // URL 생성 (S3 기본 URL 형식)
                    String url = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
                    
                    // 파일에 쓰기
                    writer.write(url);
                    writer.newLine();
                    count++;
                }

                continuationToken = response.nextContinuationToken();
            } while (continuationToken != null); // 1000개 이상일 경우 페이징 처리

            System.out.println("완료! 총 " + count + "개의 객체 URL을 저장했습니다.");
            System.out.println("저장 경로: " + outputFilePath);

        } catch (IOException e) {
            System.err.println("파일 저장 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("S3 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
