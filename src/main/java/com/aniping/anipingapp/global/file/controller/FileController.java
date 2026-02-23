package com.aniping.anipingapp.global.file.controller;

import com.aniping.anipingapp.global.constant.TargetType;
import com.aniping.anipingapp.global.file.dto.FileUploadRequestDto;
import com.aniping.anipingapp.global.file.dto.FileResponseDto;
import com.aniping.anipingapp.global.file.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<List<FileResponseDto>> uploadFiles(@ModelAttribute FileUploadRequestDto requestDto) {
        try {
            List<FileResponseDto> uploadedFiles = fileService.uploadFiles(
                    requestDto.getTargetType(),
                    requestDto.getTargetId(),
                    requestDto.getFiles()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(uploadedFiles);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<FileResponseDto>> getFiles(
            @RequestParam("targetType") TargetType targetType,
            @RequestParam("targetId") Integer targetId) {
        try {
            List<FileResponseDto> files = fileService.getFilesByTarget(targetType, targetId);
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Integer fileId) {
        try {
            fileService.deleteFile(fileId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
