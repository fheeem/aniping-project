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
        AdTagsDto savedDto = adTagsService.addTags(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDto);
    }

    //태그 위로
    @PatchMapping("/{id}/up")
    public ResponseEntity<Void> moveUp(@PathVariable int id) {
        adTagsService.moveUp(id);
        return ResponseEntity.ok().build();
    }

    //태그 아래로
    @PatchMapping("/{id}/down")
    public ResponseEntity<Void> moveDown(@PathVariable int id) {
        adTagsService.moveDown(id);
        return ResponseEntity.ok().build();
    }
}
