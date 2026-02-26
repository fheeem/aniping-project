package com.aniping.anipingapp.global.headerCategory.service;

import com.aniping.anipingapp.global.headerCategory.entity.Category;
import com.aniping.anipingapp.global.headerCategory.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HeaderCategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAllByOrderBySequenceAsc();
    }
}
