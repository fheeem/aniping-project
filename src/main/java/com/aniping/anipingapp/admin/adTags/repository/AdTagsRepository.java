package com.aniping.anipingapp.admin.adTags.repository;

import com.aniping.anipingapp.admin.adTags.entity.AdTagsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdTagsRepository extends JpaRepository<AdTagsEntity, Integer> {
    boolean existsByName(String name);
}
