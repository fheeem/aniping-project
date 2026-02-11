package com.aniping.anipingapp.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.Bucket;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.S3Object;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AwsCheckService {

    private final S3Client s3Client; // AWS SDK v2의 S3Client 사용

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

    /**
     * S3 버킷의 특정 경로(prefix)에 있는 파일 목록을 조회합니다.
     * @param bucketName 버킷 이름
     * @param prefix 폴더 경로 (예: "aniCha/")
     * @return 파일 키(전체 경로) 목록
     */
    public List<String> listFiles(String bucketName, String prefix) {
        try {
            System.out.println("버킷 [" + bucketName + "]의 [" + prefix + "] 폴더에서 파일 목록을 조회합니다.");

            ListObjectsV2Request request = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .prefix(prefix)
                    .build();

            // listObjectsV2는 페이지네이션된 결과를 반환할 수 있지만, 여기서는 첫 페이지만 가져옵니다.
            // 모든 객체를 가져오려면 listObjectsV2Paginator를 사용해야 합니다.
            List<S3Object> objects = s3Client.listObjectsV2(request).contents();

            List<String> fileKeys = objects.stream()
                    .map(S3Object::key)
                    .collect(Collectors.toList());

            System.out.println("조회된 파일 수: " + fileKeys.size());
            fileKeys.forEach(System.out::println);

            return fileKeys;

        } catch (Exception e) {
            System.err.println("파일 목록 조회 실패: " + e.getMessage());
            // 실패 시 빈 리스트 반환
            return List.of();
        }
    }
}
