package com.aniping.anipingapp.global.file.dto;

import com.aniping.anipingapp.global.constant.TargetType;
import com.aniping.anipingapp.global.file.entity.File;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class FileResponseDto {
    private final Integer id;
    private final TargetType targetType;
    private final Integer targetId;
    private final String fileUrl;
    private final String originalName;
    private final int depth;
    private final LocalDateTime createdAt;

    public static FileResponseDto from(File file) {
        return FileResponseDto.builder()
                .id(file.getId())
                .targetType(file.getTargetType())
                .targetId(file.getTargetId())
                .fileUrl(file.getS3Key())
                .originalName(file.getOriginalName())
                .depth(file.getDepth())
                .createdAt(file.getCreateAt())
                .build();
    }
}
