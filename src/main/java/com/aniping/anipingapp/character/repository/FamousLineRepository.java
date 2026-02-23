package com.aniping.anipingapp.character.repository;

import com.aniping.anipingapp.character.entity.FamousLineEntity;
import com.aniping.anipingapp.character.constant.LineStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamousLineRepository extends JpaRepository<FamousLineEntity, Integer> {
    List<FamousLineEntity> findByActiveOrderByCreateAtDesc(LineStatus active);

    Page<FamousLineEntity> findByUserIdAndDeleteAtIsNullAndActive(Long userId, LineStatus active, Pageable pageable);
}