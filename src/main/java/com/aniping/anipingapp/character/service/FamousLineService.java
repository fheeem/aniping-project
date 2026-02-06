package com.aniping.anipingapp.character.service;

import com.aniping.anipingapp.character.entity.FamousLineEntity;
import com.aniping.anipingapp.character.entity.LineStatus;
import com.aniping.anipingapp.character.repository.FamousLineRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FamousLineService {
    private final FamousLineRepository repository;

    public List<FamousLineEntity> getActiveLines() {
        return repository.findByActiveOrderByCreateAtDesc(LineStatus.accept);
    }

    @Transactional
    public void addLike(Integer lineId) {
        FamousLineEntity line = repository.findById(lineId)
                .orElseThrow(() -> new RuntimeException("Line not found"));

        line.setLikes(line.getLikes() + 1);


        repository.save(line);
    }
}