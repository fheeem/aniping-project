package com.aniping.anipingapp.global.headerCategory.repository;

import com.aniping.anipingapp.global.headerCategory.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // 순서대로 정렬하여 조회
    List<Category> findAllByOrderBySequenceAsc();
}
