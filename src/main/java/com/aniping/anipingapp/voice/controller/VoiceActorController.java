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

    @GetMapping("/ranking")
    public List<VoiceActorEntity> getCvRanking() {
        return repository.findAllByOrderByLikesDesc();
    }

    @GetMapping("/{id}")
    public VoiceActorEntity getCvDetail(@PathVariable Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("성우를 찾을 수 없습니다."));
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