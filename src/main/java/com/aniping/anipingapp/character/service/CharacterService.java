package com.aniping.anipingapp.character.service;

import com.aniping.anipingapp.character.entity.CharacterEntity;
import com.aniping.anipingapp.character.repository.CharacterRepository;
import com.aniping.anipingapp.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CharacterService {

    @Autowired
    private CharacterRepository characterRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CharacterEntity> getTopRankings(String loginId) {
        return characterRepository.findAllByOrderByVoteCountDesc();
    }

    @Transactional
    public void toggleLike(Integer characterId, String loginId) {
        userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CharacterEntity character = characterRepository.findById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found"));

        character.setVoteCount(character.getVoteCount() + 1);

        characterRepository.save(character);
    }
}