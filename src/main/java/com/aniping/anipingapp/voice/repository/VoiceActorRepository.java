package com.aniping.anipingapp.voice.repository;

import com.aniping.anipingapp.voice.entity.VoiceActorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoiceActorRepository extends JpaRepository<VoiceActorEntity, Integer> {
    List<VoiceActorEntity> findAllByOrderByLikesDesc();
}
