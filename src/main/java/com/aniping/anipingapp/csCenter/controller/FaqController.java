package com.aniping.anipingapp.csCenter.controller;

import com.aniping.anipingapp.csCenter.entity.Faq;
import com.aniping.anipingapp.csCenter.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cs") //
@RequiredArgsConstructor
public class FaqController {
    private final FaqRepository faqRepository;

    @GetMapping("/faq")
    public List<Faq> getAllFaqs() {
        return faqRepository.findAll();
    }
}
