package com.aniping.anipingapp.character.controller;

import com.aniping.anipingapp.character.entity.CharacterEntity;
import com.aniping.anipingapp.character.service.CharacterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/characters")
@CrossOrigin(origins = "http://localhost:5173")
public class CharacterController {

    @Autowired
    private CharacterService characterService;

    @GetMapping("/ranking")
    public List<CharacterEntity> getRanking(@RequestParam(required = false) Integer userId) {
        return characterService.getTopRankings(userId);
    }

    @PostMapping("/{characterId}/like")
    public void toggleLike(
            @PathVariable Integer characterId,
            @RequestParam Integer userId) {
        characterService.toggleLike(characterId, userId);
    }
}