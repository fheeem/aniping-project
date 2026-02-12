package com.aniping.anipingapp.voice.controller;

import com.aniping.anipingapp.voice.entity.VoiceActorEntity;
import com.aniping.anipingapp.voice.repository.VoiceActorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cv")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class VoiceActorController {

    private final VoiceActorRepository repository;

    // 성우 랭킹 조회 (좋아요 순)
    @GetMapping("/ranking")
    public List<VoiceActorEntity> getCvRanking() {
        return repository.findAllByOrderByLikesDesc();
    }

    // 성우 상세 정보 조회
    @GetMapping("/{id}")
    public VoiceActorEntity getCvDetail(@PathVariable Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("성우를 찾을 수 없습니다."));
    }

    // 좋아요 업데이트 (토글 방식)
    @PostMapping("/like/{id}")
    public void updateLike(@PathVariable Integer id, @RequestParam boolean isLiked) {
        VoiceActorEntity cv = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("성우를 찾을 수 없습니다."));

        if (isLiked) {
            // 이미 좋아요를 누른 상태에서 다시 누르면 취소 (-1)
            cv.setLikes(Math.max(0, cv.getLikes() - 1));
        } else {
            // 좋아요 추가 (+1)
            cv.setLikes(cv.getLikes() + 1);
        }
        repository.save(cv);
    }
}