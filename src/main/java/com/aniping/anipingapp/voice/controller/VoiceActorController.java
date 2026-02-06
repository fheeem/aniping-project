package com.aniping.anipingapp.voice.controller;

import com.aniping.anipingapp.voice.entity.VoiceActorEntity;
import com.aniping.anipingapp.voice.repository.VoiceActorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cv") // 기본 경로 확인
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class VoiceActorController {

    private final VoiceActorRepository repository;

    @GetMapping("/ranking")
    public List<VoiceActorEntity> getCvRanking() {
        return repository.findAllByOrderByLikesDesc();
    }

    // 👇 이 부분을 추가해야 상세페이지가 작동합니다!
    @GetMapping("/{id}")
    public VoiceActorEntity getCvDetail(@org.springframework.web.bind.annotation.PathVariable Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("성우를 찾을 수 없습니다."));
    }
}
