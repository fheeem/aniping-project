package com.aniping.anipingapp.character.repository;

import com.aniping.anipingapp.character.entity.CharacterLikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CharacterLikeRepository extends JpaRepository<CharacterLikeEntity, Integer> {
    Optional<CharacterLikeEntity> findByUserIdAndCharacterId(Long userId, Integer characterId);
}