package com.aniping.anipingapp.character.repository;

import com.aniping.anipingapp.character.entity.FamousLineEntity;
import com.aniping.anipingapp.character.entity.LineStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FamousLineRepository extends JpaRepository<FamousLineEntity, Integer> {
    List<FamousLineEntity> findByActiveOrderByCreateAtDesc(LineStatus active);

    Page<FamousLineEntity> findByUserIdAndDeleteAtIsNullAndActive(Long userId, LineStatus active, Pageable pageable);
}