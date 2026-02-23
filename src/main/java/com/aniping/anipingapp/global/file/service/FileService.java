package com.aniping.anipingapp.global.file.service;

import com.aniping.anipingapp.global.constant.TargetType;
import com.aniping.anipingapp.global.file.dto.FileResponseDto;
import com.aniping.anipingapp.global.file.entity.File;
import com.aniping.anipingapp.global.file.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileService {

    private final S3Client s3Client;
    private final FileRepository fileRepository;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${spring.cloud.aws.region.static}")
    private String region;

    @Transactional
    public List<FileResponseDto> uploadFiles(TargetType targetType, Integer targetId, List<MultipartFile> multipartFiles) {
        if (multipartFiles == null || multipartFiles.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }

        // ACTIVE 상태인 파일 개수만 체크
        List<File> activeFiles = fileRepository.findByTargetTypeAndTargetIdAndStatus(targetType, targetId, File.FileStatus.ACTIVE);
        if (activeFiles.size() + multipartFiles.size() > targetType.getUploadLimit()) {
            throw new IllegalArgumentException(targetType.name() + " 타입은 최대 " + targetType.getUploadLimit() + "개의 파일만 업로드할 수 있습니다.");
        }

        List<FileResponseDto> uploadedFiles = new ArrayList<>();
        int depth = activeFiles.size(); // 기존 파일 개수 다음부터 순서 매김

        for (MultipartFile multipartFile : multipartFiles) {
            if (multipartFile.isEmpty()) {
                continue;
            }

            String originalFilename = multipartFile.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String s3FileName = targetType.name() + "/" + UUID.randomUUID() + fileExtension;

            try {
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(s3FileName)
                        .contentType(multipartFile.getContentType())
                        .contentLength(multipartFile.getSize())
                        .build();

                s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(multipartFile.getInputStream(), multipartFile.getSize()));

                String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, s3FileName);

                File file = File.builder()
                        .targetType(targetType)
                        .targetId(targetId)
                        .s3Key(fileUrl)
                        .originalName(originalFilename)
                        .depth(depth++)
                        .status(File.FileStatus.ACTIVE) // 명시적으로 ACTIVE 설정
                        .build();
                fileRepository.save(file);

                uploadedFiles.add(FileResponseDto.from(file));

            } catch (IOException e) {
                throw new RuntimeException("파일 업로드 중 오류 발생: " + originalFilename, e);
            }
        }
        return uploadedFiles;
    }

    @Transactional(readOnly = true)
    public List<FileResponseDto> getFilesByTarget(TargetType targetType, Integer targetId) {
        // ACTIVE 상태인 파일만 조회
        return fileRepository.findByTargetTypeAndTargetIdAndStatus(targetType, targetId, File.FileStatus.ACTIVE)
                .stream()
                .map(FileResponseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteFile(Integer fileId) {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 파일 ID입니다: " + fileId));

        // Soft Delete: DB 상태만 변경하고 S3 파일은 유지
        file.setStatus(File.FileStatus.DELETED);
        file.setDeleteAt(LocalDateTime.now());
        fileRepository.save(file);
    }
}
