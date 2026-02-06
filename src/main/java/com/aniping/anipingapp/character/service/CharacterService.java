package com.aniping.anipingapp.character.service;

import com.aniping.anipingapp.character.entity.CharacterEntity;
import com.aniping.anipingapp.character.entity.CharacterLikeEntity;
import com.aniping.anipingapp.character.repository.CharacterRepository;
import com.aniping.anipingapp.character.repository.CharacterLikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CharacterService {

    @Autowired
    private CharacterRepository characterRepository;

    @Autowired
    private CharacterLikeRepository characterLikeRepository;

    public List<CharacterEntity> getTopRankings(Integer userId) {
        List<CharacterEntity> characters = characterRepository.findTop10ByOrderByVoteCountDesc();

        if (userId != null) {
            for (CharacterEntity character : characters) {
                Optional<CharacterLikeEntity> like = characterLikeRepository.findByUserIdAndCharacterId(userId, character.getId());
                character.setLiked(like.isPresent());
            }
        }
        return characters;
    }

    @Transactional
    public void toggleLike(Integer characterId, Integer userId) {
        CharacterEntity character = characterRepository.findById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found"));

        Optional<CharacterLikeEntity> alreadyLike = characterLikeRepository.findByUserIdAndCharacterId(userId, characterId);

        if (alreadyLike.isPresent()) {
            characterLikeRepository.delete(alreadyLike.get());
            character.setVoteCount(Math.max(0, character.getVoteCount() - 1));
        } else {
            CharacterLikeEntity newLike = new CharacterLikeEntity();
            newLike.setUserId(userId);
            newLike.setCharacterId(characterId);
            characterLikeRepository.save(newLike);
            character.setVoteCount(character.getVoteCount() + 1);
        }
        characterRepository.save(character);
    }
}