package com.aniping.anipingapp.character.repository;

import com.aniping.anipingapp.character.entity.CharacterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CharacterRepository extends JpaRepository<CharacterEntity, Integer> {
    List<CharacterEntity> findTop10ByOrderByVoteCountDesc();
}