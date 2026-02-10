package com.aniping.anipingapp.voice.controller;

import com.aniping.anipingapp.voice.entity.VoiceActorEntity;
import com.aniping.anipingapp.voice.repository.VoiceActorRepository;
import com.aniping.anipingapp.voice.service.S3MigrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cv")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class VoiceActorController {

    private final VoiceActorRepository repository;

    @GetMapping("/ranking")
    public List<VoiceActorEntity> getCvRanking() {
        return repository.findAllByOrderByLikesDesc();
    }

    @GetMapping("/{id}")
    public VoiceActorEntity getCvDetail(@PathVariable Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("성우를 찾을 수 없습니다."));
    }

    // VoiceActorController.java에 추가
    private final S3MigrationService migrationService;

    @GetMapping("/migrate")
    public String startMigration() {
        migrationService.migrateFromJson();
        return "마이그레이션이 완료되었습니다. DB를 확인하세요!";
    }

    @PostMapping("/like/{id}")
    public void updateLike(@PathVariable Integer id, @RequestParam boolean isLiked) {
        VoiceActorEntity cv = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("성우를 찾을 수 없습니다."));

        if (isLiked) {
            cv.setLikes(Math.max(0, cv.getLikes() - 1));
        } else {
            cv.setLikes(cv.getLikes() + 1);
        }
        repository.save(cv);
    }
}