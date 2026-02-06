package com.aniping.anipingapp.character.controller;

import com.aniping.anipingapp.character.entity.FamousLineEntity;
import com.aniping.anipingapp.character.service.FamousLineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lines")
@RequiredArgsConstructor
public class FamousLineController {
    private final FamousLineService service;

    @GetMapping("/active")
    public List<FamousLineEntity> getActiveLines() {
        return service.getActiveLines();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likeLine(@PathVariable Integer id) {
        service.addLike(id);
        return ResponseEntity.ok().build();
    }
}