package com.aniping.anipingapp.admin.adTags.controller;

import com.aniping.anipingapp.admin.adTags.dto.AdTagsDto;
import com.aniping.anipingapp.admin.adTags.service.AdTagsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/AdminAni/tag")
@RequiredArgsConstructor
public class AdTagsController {
    private final AdTagsService adTagsService;

    //조회
    @GetMapping
    public ResponseEntity<List<AdTagsDto>> getAllTags() {
        List<AdTagsDto> tags = adTagsService.findAllTags();
        return ResponseEntity.ok(tags);
    }

    //삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable int id) {
        adTagsService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    //추가
    @PostMapping("/create")
    public ResponseEntity<?> createTag(@Valid @RequestBody AdTagsDto dto) {
        try {
            AdTagsDto savedDto = adTagsService.addTags(dto);
            return ResponseEntity.ok(savedDto);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
