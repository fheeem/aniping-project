package com.aniping.anipingapp.character.repository;

import com.aniping.anipingapp.character.entity.FamousLineEntity;
import com.aniping.anipingapp.character.entity.LineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FamousLineRepository extends JpaRepository<FamousLineEntity, Integer> {
    // findByStatus 대신 findByActive 사용
    List<FamousLineEntity> findByActiveOrderByCreateAtDesc(LineStatus active);
}