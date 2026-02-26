package com.aniping.anipingapp.global.headerCategory.controller;

import com.aniping.anipingapp.global.headerCategory.entity.Category;
import com.aniping.anipingapp.global.headerCategory.service.HeaderCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/header/categories")
@RequiredArgsConstructor
public class HeaderCategoryController {

    private final HeaderCategoryService headerCategoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(headerCategoryService.getAllCategories());
    }
}
