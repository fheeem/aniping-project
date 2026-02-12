package com.aniping.anipingapp.character.controller;

import com.aniping.anipingapp.character.entity.CharacterEntity;
import com.aniping.anipingapp.character.service.CharacterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/characters")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CharacterController {

    @Autowired
    private CharacterService characterService;

    @GetMapping("/ranking")
    public List<CharacterEntity> getRanking(Principal principal) {
        String loginId = (principal != null) ? principal.getName() : null;
        return characterService.getTopRankings(loginId);
    }

    @PostMapping("/{characterId}/like")
    public void toggleLike(@PathVariable Integer characterId, Principal principal) {

        System.out.println("123231414141241");
        log.info("프린시펄 데이터 확인 유저 좋아요기능: "+ principal);
        System.out.println("프린시펄 데이터 확인 유저 좋아요기능222: "+ principal);

        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Log in required");
        }
        characterService.toggleLike(characterId, principal.getName());
    }
}