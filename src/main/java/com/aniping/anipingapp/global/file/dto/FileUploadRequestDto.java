package com.aniping.anipingapp.global.file.dto;

import com.aniping.anipingapp.global.constant.TargetType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class FileUploadRequestDto {
    private TargetType targetType;
    private Integer targetId;
    private List<MultipartFile> files;
}
