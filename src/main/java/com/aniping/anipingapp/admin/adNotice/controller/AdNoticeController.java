package com.aniping.anipingapp.admin.adNotice.controller;

import com.aniping.anipingapp.admin.adNotice.dto.AdNoticeDto;
import com.aniping.anipingapp.admin.adNotice.service.AdNoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/AdminNotice")
@RequiredArgsConstructor
public class AdNoticeController {
    private final AdNoticeService adNoticeService;

    //조회
    @GetMapping("/")
    public ResponseEntity<List<AdNoticeDto>> getAllNotices(){
        List<AdNoticeDto> notices = adNoticeService.getAllNotices();
        return ResponseEntity.ok(notices);
    }

    //삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable("id") Integer id) {
        adNoticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }

    //추가
    @PostMapping("/create")
    public ResponseEntity<AdNoticeDto> createNotice(
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam Integer userId) {
        return ResponseEntity.ok(adNoticeService.saveNotice(title, content, userId));
    }

    //수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateNotice(
            @PathVariable Integer id,
            @RequestParam String title,
            @RequestParam String content) {
        adNoticeService.updateNotice(id, title, content);
        return ResponseEntity.ok().build();
    }

    //검색
    @GetMapping("/search")
    public ResponseEntity<List<AdNoticeDto>> searchNotices(@RequestParam String keyword) {
        return ResponseEntity.ok(adNoticeService.searchNoticesByTitle(keyword));
    }
}
