package com.aniping.anipingapp.admin.adTags.repository;

import com.aniping.anipingapp.admin.adTags.entity.AdTagsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdTagsRepository extends JpaRepository<AdTagsEntity, Integer> {

    @Query("SELECT COALESCE(MAX(a.sequence), 0) FROM AdTagsEntity a")
    int findMaxSequence();

    Optional<AdTagsEntity> findFirstBySequenceLessThanOrderBySequenceDesc(int sequence);

    Optional<AdTagsEntity> findFirstBySequenceGreaterThanOrderBySequenceAsc(int sequence);
}
